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
		// JS Rewriter
		INCLUDE_ESNIFF: JSON.stringify(true),
		INCLUDE_AST_PARSER_SEAFOX: JSON.stringify(true),
		INCLUDE_AST_PARSER_OXC: JSON.stringify(false),
		INCLUDE_AST_WALKER_TRAVERSE_THE_UNIVERSE: JSON.stringify(true)
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
	entry: {
		sandbox: {
			import: "./build/init.ts",
			dependsOn: "jsRewriter"
		},
		jsRewriter: {
			import: "./src/sandboxers/JS/JSRewriter.ts"
		}
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
	output: {
		filename: "[name].aero.js",
		path: path.resolve(__dirname, "dist")
	}
} as rspack.Configuration;
