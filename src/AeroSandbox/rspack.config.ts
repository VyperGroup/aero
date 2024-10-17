import path from "node:path";
import { access, rm, mkdir, copyFile } from "node:fs/promises";

import rspack from "@rspack/core";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

const liveBuildMode = "LIVE_BUILD" in process.env; // Live debugging
let debugMode = liveBuildMode || "DEBUG" in process.env;
const minimalBuild = true || "BUILD_MINIMAL" in process.env; // Build AeroSandbox without the extra APIs. This should be used when building just for the proxy only;
const testBuild = "TEST_BUILD" in process.env; // Makes independent build files for each module that will be tested in the unit testing
if (!debugMode && testBuild) debugMode = true;

import createFeatureFlags from "./createFeatureFlags";

const featureFlags = createFeatureFlags({ debugMode });

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any[] = [
	// @ts-ignore
	new rspack.DefinePlugin(featureFlags)
];

if (debugMode)
	plugins.push(
		new RsdoctorRspackPlugin({
			port: 3301,
			// Do not pop up every time in a live build watcher scenario (annoying)
			//disableClientServer: liveBuildMode
		})
	);

const properDirType = debugMode ? "debug" : "prod";
const properDir = path.resolve(__dirname, "dist", properDirType);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const output: any = {
	filename: "[name].js",
	path: testBuild
		? path.resolve(__dirname, "../../tests/aero")
		: properDir,
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
	entry: testBuild
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
				ElectronWebView: "./src/apis/CustomViews/ElectronWebView.ts"
			}
			: defaultBuild,
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

if (debugMode) config.watch = true;

const distDir = path.resolve(__dirname, "dist");
initDist();
function initDist() {
	access(distDir)
		.then(() => {
			rm(distDir, {
				recursive: true
			}).then(createDistDir);
		})
		// If dir doesn't exist
		.catch(createDistDir);
}
function createDistDir() {
	mkdir(distDir).then(initProperDir);
}
function initProperDir() {
	access(distDir)
		.then(() => {
			rm(distDir, {
				recursive: true
			}).then(createProperDir);
		})
		// If dir doesn't exist
		.catch(createProperDir);
}
function createProperDir() {
	mkdir(properDir).then(createConfigBuild);
}
function createConfigBuild() {
	mkdir(distDir).then(() => {
		copyFile(
			path.resolve(__dirname, "src/defaultConfig.js"),
			path.resolve(__dirname, `dist/${properDirType}/defaultConfig.js`)
		);
	});
}

export default config;
