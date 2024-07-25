import path from "path";
import rspack from "@rspack/core";

import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const debugMode = process.env.DEBUG;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any[] = [
	new CleanWebpackPlugin(),
	new rspack.DefinePlugin({
		// Webpack Feature Flags
		FEATURE_CORS_EMULATION: JSON.stringify(false),
		FEATURE_INTEGRITY_EMULATION: JSON.stringify(false),
		FEATURE_ENC_BODY_EMULATION: JSON.stringify(false),
		FEATURE_CACHES_EMULATION: JSON.stringify(false),
		FEATURE_CLEAR_EMULATION: JSON.stringify(false),
		REWRITER_HTML: JSON.stringify(false),
		REWRITER_XSLT: JSON.stringify(false),
		REWRITER_JS: JSON.stringify(false),
		REWRITER_CACHE_MANIFEST: JSON.stringify(false),
		SUPPORT_LEGACY: JSON.stringify(false),
		SUPPORT_WORKER: JSON.stringify(false),
		DEBUG: JSON.stringify(false)
	})
];

if (debugMode)
	plugins.push(
		new RsdoctorRspackPlugin({
			port: 3300
		})
	);

export default {
	mode: debugMode ? "development" : "production",
	entry: "./src/this/handle.ts",
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
		filename: "sw.aero.js",
		path: path.resolve(__dirname, "dist")
	}
} as rspack.Configuration;
