import path from "node:path";
import { access, rm, mkdir, copyFile } from "node:fs/promises";

import rspack from "@rspack/core";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

import createFeatureFlags from "./createFeatureFlags";

const debugMode = "DEBUG" in process.env;
const serverMode = process.env.SERVER_MODE;

const featureFlags = createFeatureFlags({ debugMode });

if (serverMode) {
	featureFlags.REQ_INTERCEPTION_CATCH_ALL = "referrer";
	if (serverMode === "winterjs") featureFlags.SERVER_ONLY = "winterjs";
	else if (serverMode === "cf-workers")
		featureFlags.SERVER_ONLY = "cf-workers";
} else featureFlags.REQ_INTERCEPTION_CATCH_ALL = "clients";

console.log(featureFlags);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
		sw: path.resolve(__dirname, "./src/this/handle.ts")
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
		filename: "[name].aero.js",
		path: path.resolve(__dirname, "dist"),
		iife: true
	},
	target: "webworker"
};

if (debugMode) config.watch = true;

access(path.resolve(__dirname, "dist"))
	.then(() => {
		rm(path.resolve(__dirname, "dist"), {
			recursive: true
		}).then(() => {
			createConfigBuild();
		});
	})
	.catch(() => {
		createConfigBuild();
	});
function createConfigBuild() {
	mkdir(path.resolve(__dirname, "dist")).then(() => {
		copyFile(
			path.resolve(__dirname, "src/defaultConfig.js"),
			path.resolve(__dirname, "dist/defaultConfig.aero.js")
		);
	});
}

export default config;
