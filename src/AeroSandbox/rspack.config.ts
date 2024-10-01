import path from "path";
import rspack from "@rspack/core";
import { EntryDescription } from "@rspack/core";

import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

let debugMode = "DEBUG" in process.env; // Live debugging
const minimalBuild = "BUILD_MINIMAL" in process.env; // Build AeroSandbox without the extra APIs. This should be used when building just for the proxy only;
const testBuild = "TEST_BUILD" in process.env; // Makes independent build files for each module that will be tested in the unit testing
if (!debugMode && testBuild) debugMode = true;

import createFeatureFlags from "./createFeatureFlags";

const featureFlags = createFeatureFlags({ debugMode });

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any[] = [
	new CleanWebpackPlugin(),
	// @ts-ignore
	new rspack.DefinePlugin(featureFlags)
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

const defaultBuild = {
	sandbox: "./build/init.ts",
	jsRewriter: "./src/sandboxers/JS/JSRewriter.ts",
	featureFlags: "./src/featureFlags.ts",
	swAdditions: "./src/swAdditions.ts"
};

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

export default config;
