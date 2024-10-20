import path from "node:path";
import { access, rm, mkdir, copyFile } from "node:fs/promises";

import rspack from "@rspack/core";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

//import type { FeatureFlagsRspackOptional } from "types/featureFlags";
import createFeatureFlags from "./createDefaultFeatureFlags";

const liveBuildMode = "LIVE_BUILD" in process.env;
/** This var is enabled by default */
const verboseMode =
	!("VERBOSE" in process.env) || process.env.VERBOSE !== "false"; // TODO: Copy the verbose pattern for aero's build system
const debugMode = liveBuildMode || "DEBUG" in process.env;
const serverMode = process.env.SERVER_MODE;

import { log } from "./src/AeroSandbox/rspack.config.ts";

import importSync from "import-sync";

// TODO: Type assert `as FeatureFlagsRspackOptional`

const { default: featureFlagOverrides } = importSync("./createFeatureFlags", {
	cjs: false
});

const featureFlags = createFeatureFlags({
	...featureFlagOverrides,
	debugMode
});

if (serverMode) {
	// @ts-ignore
	featureFlags.REQ_INTERCEPTION_CATCH_ALL = JSON.stringify("referrer");
	if (serverMode === "winterjs")
		// @ts-ignore
		featureFlags.SERVER_ONLY = JSON.stringify("winterjs");
	else if (serverMode === JSON.stringify("cf-workers"))
		// @ts-ignore
		featureFlags.SERVER_ONLY = JSON.stringify("cf-workers");
	// @ts-ignore
} else {
	// @ts-ignore
	featureFlags.REQ_INTERCEPTION_CATCH_ALL = JSON.stringify("clients");
	// @ts-ignore
	featureFlags.SERVER_ONLY = JSON.stringify(false);
}
//@ts-ignore
featureFlags.GITHUB_REPO = JSON.stringify(featureFlags.GITHUB_REPO);

log("The chosen feature flags are:");
log(featureFlags);

// biome-ignore lint/suspicious/noExplicitAny: I don't know the exact type to use for this at the moment
const plugins: any = [
	// @ts-ignore
	new rspack.DefinePlugin(featureFlags)
];

if (debugMode)
	plugins.push(
		// There are currently a bug with Rsdoctor where the option `disableClientServer` doesn't work. You must launch the bundle analyzer through the cli instead.
		new RsdoctorRspackPlugin({
			//port: 3300,
			// Do not pop up every time (annoying)
			disableClientServer: liveBuildMode,
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
const properDir = path.resolve(__dirname, "dist", properDirType, "sw");

log(`Building in ${properDirType} mode`);
if (liveBuildMode) log("Building in live build mode");

const sourceMapType = debugMode ? "eval-source-map" : "source-map";

const config: rspack.Configuration = {
	mode: debugMode ? "development" : "production",
	//devtool: sourceMapType,
	entry: {
		sw: path.resolve(__dirname, "./src/this/handleSW.ts")
		// Building these bundles separately allows for the user to roll out their own config files without having to build aero as a whole
	},
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
				loader: "builtin:swc-loader"
			}
		]
	},
	output: {
		filename: "[name].js",
		path: properDir,
		iife: true,
		libraryTarget: "es2022"
	},
	target: ["webworker", "es2022"]
};

if (debugMode) config.watch = true;

const distDir = path.resolve(__dirname, "dist");
const swDir = path.resolve(__dirname, "dist", properDirType, "sw");
initDist();
function initDist() {
	console.info("Initializing the dist folder");
	access(distDir)
		.then(initProperDir)
		// If dir doesn't exist
		.catch(createDistDir);
}
function createDistDir() {
	console.info("Creating the dist folder");
	mkdir(distDir).then(initProperDir);
}
function initProperDir() {
	console.info("Initializing the proper folder (...dist/<debug/prod>)");
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
	console.info("Creating the proper folder");
	mkdir(properDir).then(initSW);
}
function initSW() {
	console.info("Initializing the SW folder (...dist/<debug/prod>/sw");
	access(swDir)
		.then(() => {
			rm(swDir, {
				recursive: true
			}).then(createSW);
		})
		// If dir doesn't exist
		.catch(createSW);
}
function createSW() {
	console.info("Creating the SW folder");
	mkdir(path.resolve(swDir)).then(initFiles);
}
function initFiles() {
	log("Copying over the default files to the dist folder");
	copySWFiles();
	initLogo();
}
function copySWFiles() {
	copyFile(
		path.resolve(__dirname, "src/defaultConfig.js"),
		path.resolve(`${swDir}/defaultConfig.js`)
	).catch(err => {
		console.error("Error copying defaultConfig.js:", err);
	});
}
function initLogo() {
	copyFile(
		path.resolve(__dirname, "aero.webp"),
		path.resolve(`${swDir}/logo.webp`)
	).catch(err => {
		console.error("Error copying logo.webp:", err);
	});
}

export default config;
