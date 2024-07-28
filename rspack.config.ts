import { boolFlag, FeatureFlags } from "./src/featureFlags";

import path from "path";
import rspack from "@rspack/core";

import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const debugMode = "DEBUG" in process.env;

const webpackFeatureFlags: FeatureFlags = {
	FEATURE_URL_ENC: boolFlag(false),
	FEATURE_CORS_EMULATION: boolFlag(false),
	FEATURE_INTEGRITY_EMULATION: boolFlag(false),
	FEATURE_ENC_BODY_EMULATION: boolFlag(false),
	FEATURE_CACHES_EMULATION: boolFlag(false),
	FEATURE_CLEAR_EMULATION: boolFlag(false),
	REWRITER_HTML: boolFlag(false),
	REWRITER_XSLT: boolFlag(false),
	REWRITER_JS: boolFlag(false),
	REWRITER_CACHE_MANIFEST: boolFlag(false),
	SUPPORT_LEGACY: boolFlag(false),
	SUPPORT_WORKER: boolFlag(false),
	DEBUG: JSON.stringify(debugMode)
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any = [
	// @ts-ignore
	new CleanWebpackPlugin(),
	// @ts-ignore
	new rspack.DefinePlugin(webpackFeatureFlags)
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
		sw: path.resolve(__dirname, "./src/this/handle.ts"),
		config: path.resolve(__dirname, "./src/config.ts")
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
			? path.resolve(__dirname, "dev-server/aero-demo-site/aero")
			: path.resolve(__dirname, "dist"),
		iife: true,
		clean: true
	},
	target: "webworker"
};

if (debugMode) config.watch = true;

export default config;