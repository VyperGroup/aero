import path from "node:path";

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

// This is the most important env variable
const buildConfigPath = "BUILD_CONFIG_PATH" in process.env;
if (!buildConfigPath) {
	console.error(
		"Fatal: BUILD_CONFIG_PATH env variable not set. Don't know what to build for!"
	);
	process.exit(1);
}

import createDefaultFeatureFlags from "./createDefaultFeatureFlags";
import importSync from "import-sync";

// Scripts
import InitDist from "./scripts/InitDist";
import genWebIDL from "./scripts/initApiTypes";
import initApis from "./scripts/initApis";

import featureFlagsBuilder from "./featureFlagsBuilder";

// TODO: Type assert with partial
let featureFlagOverrides = {};
try {
	featureFlagOverrides = importSync("./createFeatureFlags.ts").default;
} catch (_err) {
	console.warn(
		"⚠️ Unable to find any feature flag overrides. Is this intentional?"
	);
}

const featureFlags = createDefaultFeatureFlags({
	...featureFlagOverrides,
	debugMode
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any[] = [
	new rspack.DefinePlugin(featureFlagsBuilder(featureFlags)),
	new rspack.DefinePlugin({
		BUILD_CONFIG_PATH: JSON.stringify(buildConfigPath)
	})
];

/** A rudimentary log function that only logs if verbose mode is enabled */
export class Logger {
	verboseMode: boolean;
	constructor(verboseMode) {
		this.verboseMode = verboseMode;
	}
	log(msg: any) {
		if (this.verboseMode) console.log(...arguments);
	}
}

const logger = new Logger(verboseMode);

logger.log("The chosen feature flags are:");
logger.log(featureFlags);

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

logger.log(
	`\nBuilding in ${properDirType === "prod" ? "production" : "debug"} mode`
);
if (liveBuildMode) logger.log("Building in live build mode");

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const output: any = {
	filename: "[name].js",
	path: testBuild ? path.resolve(__dirname, "../../tests/aero") : properDir,
	clean: false
};

if (testBuild) output.library = ["Mod", "[name]"];

const defaultBuild = {
	sandbox: "./build/init.ts",
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

new InitDist(
	{
		dist: path.resolve(__dirname, "dist"),
		proper: properDir
	},
	properDirType,
	verboseMode
);
genWebIDL(verboseMode);
initApis();

export default config;
