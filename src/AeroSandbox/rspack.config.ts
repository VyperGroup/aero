import path from "path";
import rspack from "@rspack/core";
import { EntryDescription } from "@rspack/core";

import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

import { FeatureFlags, boolFlag } from "./build/featureFlags";

let debugMode = "DEBUG" in process.env; // Live debugging
const testBuild = "TEST_BUILD" in process.env; // Makes independent build files for each module that will be tested in the unit testing\
if (!debugMode && testBuild) debugMode = true;

const webpackFeatureFlags: FeatureFlags = {
	// JS Rewriter
	INCLUDE_ESNIFF: boolFlag(true),
	INCLUDE_AST_PARSER_SEAFOX: boolFlag(true),
	INCLUDE_AST_PARSER_OXC: boolFlag(false),
	INCLUDE_AST_WALKER_TRAVERSE_THE_UNIVERSE: boolFlag(true),
	SUPPORTED_HTML_REWRITER_MODES: JSON.stringify([
		"mutation_observer",
		"custom_elements",
		"domparser",
		"sw_parser"
	]),
	HTML_USE_IS_ATTR: boolFlag(false),
	HTML_USE_NAV_EVENTS: boolFlag(false),
	FEATURE_EMU_SECURE_CONTEXT: boolFlag(false),
	FEATURE_HASH_URL: boolFlag(false),
	DEBUG: boolFlag(debugMode)
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any[] = [
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const output: any = {
	filename: "[name].aero.js",
	path: testBuild
		? path.resolve(__dirname, "../../tests/aero")
		: debugMode
		  ? path.resolve(
					__dirname,
					"../../dev-server/aero-demo-site/aero/sandbox"
			  )
		  : path.resolve(__dirname, "dist"),
	clean: true
};

if (testBuild) output.library = ["Mod", "[name]"];

const config: rspack.Configuration = {
	mode: debugMode ? "development" : "production",
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
		: {
				sandbox: "./build/init.ts",
				jsRewriter: "./src/sandboxers/JS/JSRewriter.ts",
				config: "./src/config.ts"
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

export default config;
