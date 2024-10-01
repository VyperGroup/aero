import path from "node:path";
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any = [
	// @ts-ignore
	new rspack.DefinePlugin(featureFlags)
];

if (debugMode)
	plugins.push(
		new RsdoctorRspackPlugin({
			port: 3300
		})
	);

const config: rspack.Configuration = {
	mode: debugMode ? "development" : "production",
	entry: {
		BareMux: path.resolve(__dirname, "./src/internal/BareMux.ts"),
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
		path: debugMode
			? path.resolve(__dirname, "dev-server/demo-site/aero")
			: path.resolve(__dirname, "dist"),
		iife: true,
		clean: true
	},
	target: "webworker"
};

if (debugMode) config.watch = true;

export default config;
