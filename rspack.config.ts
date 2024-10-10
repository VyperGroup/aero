import path from "node:path";
import { access, rm, mkdir, copyFile } from "node:fs/promises";

import rspack from "@rspack/core";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

import createFeatureFlags from "./createFeatureFlags";

const debugMode = "DEBUG" in process.env;
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
} else featureFlags.REQ_INTERCEPTION_CATCH_ALL = JSON.stringify("clients");

// biome-ignore lint/suspicious/noExplicitAny: I don't know the exact type to use for this at the moment
const plugins: any = [
	// @ts-ignore
	new rspack.DefinePlugin(featureFlags)
];

if (debugMode)
	plugins.push(
		new RsdoctorRspackPlugin({
			port: 3300,
			// Do not pop up every time (annoying)
			disableClientServer: true
		})
	);

const config: rspack.Configuration = {
	mode: debugMode ? "development" : "production",
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
		path: path.resolve(__dirname, "dist", "sw"),
		iife: true
	},
	target: "webworker"
};

if (debugMode) config.watch = true;

access(path.resolve(__dirname, "dist"))
	.then(() => afterDist())
	.catch(() => {
		mkdir(path.resolve(__dirname, "dist")).then(() => {
			afterDist();
		});
	});
function afterDist() {
	access(path.resolve(__dirname, "dist", "sw"))
		.then(() => {
			rm(path.resolve(__dirname, "dist", "sw"), {
				recursive: true
			}).then(() => afterSW);
		})
		.catch(() => {
			mkdir(path.resolve(__dirname, "dist", "sw")).then(afterSW);
		});
}
function afterSW() {
	copyFile(
		path.resolve(__dirname, "src/defaultConfig.js"),
		path.resolve(__dirname, "dist/sw/defaultConfig.js")
	);
}

export default config;
