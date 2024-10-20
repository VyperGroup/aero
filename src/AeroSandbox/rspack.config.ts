import path from "node:path";
import { access, rm, mkdir, copyFile } from "node:fs/promises";

import { globSync } from "glob";

import rspack from "@rspack/core";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

const liveBuildMode = "LIVE_BUILD" in process.env;
let debugMode = liveBuildMode || "DEBUG" in process.env;
/** This var is enabled by default */
const verboseMode =
	!("VERBOSE" in process.env) || process.env.VERBOSE !== "false";
/** Build AeroSandbox without the extra APIs. This should be used when building just for the proxy only; **/
const minimalBuild = true || "BUILD_MINIMAL" in process.env;
const minimalSharedBuild = "BUILD_SHARED_MINIMAL" in process.env;
/** Makes independent build files for each module that will be tested in the unit testing **/
const testBuild = "TEST_BUILD" in process.env;
if (!debugMode && testBuild) debugMode = true;

// For WebIDL -> TS conversion
// I shouldn't have to do this, but they forgot to include the "exports" definition inside their package.json, and I don't want to maintain a fork. They also defined exports for these modules in their index.js, which should be enough by itself, but they invoked the CLI, making this useless since that action throws an error.
const fetchIDLModPath = path.resolve(
	__dirname,
	"node_modules",
	"@milkshakeio",
	"webidl2ts",
	"dist",
	"fetch-idl.js"
);
const fetchIDLMod = require(fetchIDLModPath);
const fetchIDL = fetchIDLMod.fetchIDL;
const parseIDLModPath = path.resolve(
	__dirname,
	"node_modules",
	"@milkshakeio",
	"webidl2ts",
	"dist",
	"parse-idl.js"
);
const parseIDLMod = require(parseIDLModPath);
const parseIDL = parseIDLMod.parseIDL;
const convertIDLModPath = path.resolve(
	__dirname,
	"node_modules",
	"@milkshakeio",
	"webidl2ts",
	"dist",
	"convert-idl.js"
);
const convertIDLMod = require(convertIDLModPath);
const convertIDL = convertIDLMod.convertIDL;
const printTsModPath = path.resolve(
	__dirname,
	"node_modules",
	"@milkshakeio",
	"webidl2ts",
	"dist",
	"print-ts.js"
);
const printTsMod = require(printTsModPath);
const printTs = printTsMod.printTs;

import { writeFileSync } from "node:fs";

import createDefaultFeatureFlags from "./createDefaultFeatureFlags";
import importSync from "import-sync";

import featureFlagsBuilder from "./featureFlagsBuilder";

// TODO: Type assert with partial
let featureFlagOverrides = {};
try {
	featureFlagOverrides = importSync("./createFeatureFlags.ts").default
} catch (_err) {
	console.warn("⚠️ Unable to find any feature flag overrides. Is this intentional?");
}

const featureFlags = createDefaultFeatureFlags({
	...featureFlagOverrides,
	debugMode
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any[] = [
	new rspack.DefinePlugin(featureFlagsBuilder(featureFlags)),
];

log("The chosen feature flags are:");
log(featureFlags);

if (debugMode)
	plugins.push(
		// There are currently a bug with Rsdoctor where the option `disableClientServer` doesn't work. You must launch the bundle analyzer through the cli instead.
		new RsdoctorRspackPlugin({
			//port: 3301,
			// Do not pop up every time in a live build watcher scenario (annoying)
			disableClientServer: true,
			linter: {
				rules: {
					// Don't warn about using non ES5 features
					"ecma-version-check": "off"
				}
			},
			supports: {
				generateTileGraph: true
			}
		})
	);

const properDirType = debugMode ? "debug" : "prod";
const properDir = path.resolve(__dirname, "dist", properDirType);

log(`\nBuilding in ${properDirType === "prod" ? "production" : "debug"} mode`);
if (liveBuildMode) log("Building in live build mode");

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const output: any = {
	filename: "[name].js",
	path: testBuild ? path.resolve(__dirname, "../../tests/aero") : properDir,
	clean: false
};

if (testBuild) output.library = ["Mod", "[name]"];

const defaultBuild = {
	sandbox: "./build/initApis.ts",
	jsRewriter: "./src/sandboxers/JS/JSRewriter.ts",
	featureFlags: "./src/featureFlags.ts",
	swAdditions: "./src/swAdditions.ts"
};

const config: rspack.Configuration = {
	mode: debugMode ? "development" : "production",
	optimization: {
		chunkIds: "named"
	},
	entry: genEntryFiles(
		testBuild
			? {
				// API Interceptors for the Script Sandbox
				location: "./src/interceptors/loc/location.ts",
				scriptSandbox:
					"./src/interceptors/concealer/misc/scriptSandboxing.ts",
				// Libs for the API Interceptors
				loggers: "./src/shared/Loggers.ts",
				replaceProxyNamespace: "./build/replaceProxyNamespace.ts",
				// The JS rewriter
				jsRewriter: "./src/sandboxers/JS/JSRewriter.ts"
			}
			: minimalBuild
				? {
					...defaultBuild,
					// Extra APIs
					storageIsolation:
						"./src/apis/StorageIsolator/storageIsolation.ts",
					ControlView: "./src/apis/CustomViews/ControlView.ts",
					ElectronControlView:
						"./src/apis/CustomViews/ElectronControlView.ts",
					ElectronWebView:
						"./src/apis/CustomViews/ElectronWebView.ts"
				}
				: defaultBuild
	),
	plugins,
	resolve: {
		extensions: [".ts"],
		tsConfig: path.resolve(__dirname, "./tsconfig.json")
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/[\\/]node_modules[\\/]/],
				use: [
					{
						loader: "builtin:swc-loader"
					}
				]
			}
		]
	},
	output
};

/**
 * The purpose of this function is to add on to the entry files provided in the argument but also to define separate bundles for all of the code shared with the SW. This function does nothing in debug mode.
 */
function genEntryFiles(entryFiles) {
	/*
	if (minimalSharedBuild) {
		const modulesSharedWithSW = globSync(`${__dirname}/src/shared/*.ts`)
		return [...entryFiles, ...modulesSharedWithSW];
	}
	*/
	return entryFiles;
}

if (debugMode) config.watch = true;

const distDir = path.resolve(__dirname, "dist");
initDist();
function initDist() {
	log("Initializing the dist folder");
	access(distDir)
		.then(initProperDir)
		// If dir doesn't exist
		.catch(createDistDir);
}
function createDistDir() {
	log("Creating the dist folder");
	mkdir(distDir).then(initProperDir);
}
function initProperDir() {
	log("Initializing the proper folder (...dist/<debug/prod>)");
	access(properDir)
		.then(() => {
			rm(properDir, {
				recursive: true
			}).then(createProperDir);
		})
		// If dir doesn't exist
		.catch(createProperDir);
}
function createProperDir() {
	log("Creating the proper folder");
	mkdir(properDir).then(createDistBuild);
}
function createDistBuild() {
	log("Copying over the default config to the dist folder");
	copyFile(
		path.resolve(__dirname, "src/defaultConfig.js"),
		path.resolve(__dirname, `dist/${properDirType}/defaultConfig.js`)
	);
}

type webIDLDesc = { [key: string]: string };
const webIDLUsedInAero: webIDLDesc = {
	"cookie-store": "https://wicg.github.io/cookie-store/",
	// fedcm: "https://fedidcg.github.io/FedCM/", FIXME: Broken
	"shared-storage": "https://wicg.github.io/shared-storage/",
	"web-app-launch": "https://wicg.github.io/web-app-launch/",
	"web-otp": "https://wicg.github.io/web-otp/"
};
const webIDLOutputDir = path.resolve(__dirname, "types/webidlDist");
// Gens to types/webidlDist
function genWebIDL(webIDL: webIDLDesc) {
	log("\nGenerating the WebIDL -> TS conversions required in aero");
	access(webIDLOutputDir).catch(() => mkdir(webIDLOutputDir));
	for (const [apiName, apiDocURL] of Object.entries(webIDL)) {
		log(`Fetching the WebIDL for ${apiName} with URL ${apiDocURL}`);
		fetchIDL(apiDocURL).then(rawIdl => {
			log(`Parsing the WebIDL for ${apiName}`);
			parseIDL(rawIdl).then(idl => {
				log(`Converting the WebIDL -> TS for ${apiName}`);
				const ts = convertIDL(idl, {
					emscripten: false
				});

				log(`Applying the final touches to ${apiName}`);
				const tsString = printTs(ts);

				// Parity check: if the string is blank
				if (tsString === "") {
					const errMsg = "The ts string is invalid";
					if (!debugMode) console.warn(`⚠️ ${errMsg}`);
					else throw new Error(errMsg);
				}

				log(`Writing the WebIDL for ${apiName}`);
				writeFileSync(
					path.resolve(webIDLOutputDir, `${apiName}.d.ts`),
					`// Auto-generated by webidl2ts - ${apiDocURL}\n${tsString}`
				);
			});
		});
	}
}
genWebIDL(webIDLUsedInAero);

/** A rudimentary log function that only logs if verbose mode is enabled */
export function log(msg: any) {
	if (verboseMode) log(...arguments);
}

export default config;
