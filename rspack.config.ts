import path from "node:path";
import { access, rm, mkdir, copyFile } from "node:fs/promises";

import rspack from "@rspack/core";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

import createFeatureFlags from "./createFeatureFlags";

const liveBuildMode = "LIVE_BUILD" in process.env; // Live debugging
const debugMode = liveBuildMode || "DEBUG" in process.env;
const serverMode = process.env.SERVER_MODE;

const featureFlags = createFeatureFlags({ debugMode });

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

console.log(featureFlags);

// biome-ignore lint/suspicious/noExplicitAny: I don't know the exact type to use for this at the moment
const plugins: any = [
	// @ts-ignore
	new rspack.DefinePlugin(featureFlags)
	//new rspack.SourceMapDevToolPlugin({})
];

if (debugMode)
	plugins.push(
		new RsdoctorRspackPlugin({
			port: 3300,
			// Do not pop up every time (annoying)
			//disableClientServer: liveBuildMode
		})
	);

const properDirType = debugMode ? "debug" : "prod";
const properDir = path.resolve(__dirname, "dist", properDirType, "sw");

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
		tsConfigPath: path.resolve(__dirname, "./tsconfig.json")
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
	target: "webworker"
};

if (debugMode) config.watch = true;

const distDir = path.resolve(__dirname, "dist");
const swDir = path.resolve(__dirname, "dist", properDirType, "sw");
initDist();
function initDist() {
	access(distDir)
		.then(initProperDir)
		// If dir doesn't exist
		.catch(createDistDir);
}
function createDistDir() {
	mkdir(distDir).then(initProperDir);
}
function initProperDir() {
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
	mkdir(properDir).then(initSW);
}
function initSW() {
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
	mkdir(path.resolve(swDir)).then(initFiles);
}
function initFiles() {
	copySWFiles()
	initLogo();
}
function copySWFiles() {
	copyFile(
		path.resolve(__dirname, "src/defaultConfig.js"),
		path.resolve(`${swDir}/defaultConfig.js`)
	).catch((err) => {
		console.error("Error copying defaultConfig.js:", err);
	});
}
function initLogo() {
	copyFile(
		path.resolve(__dirname, "aero.webp"),
		path.resolve(`${swDir}/logo.webp`)
	).catch((err) => {
		console.error("Error copying logo.webp:", err);
	});
}

export default config;
