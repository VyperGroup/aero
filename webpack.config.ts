const path = require("path");
// TODO: Use Path.join instead of the hacky templates approach
//import path, { join } from "node:path";

import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const config = {
	split: false,
	debug: false,
	src: "./src/",
};

// TODO: Support WebExtension and CF Workers backends
module.exports = {
	mode: config.debug ? "development" : "production",
	devtool: config.debug ? "eval" : "source-map",
	entry: {
		config: {
			import: `${config.src}config.ts`,
			// This is made importable for proxy sites that implement aero
			library: {
				type: "module",
			},
		},
		browser: {
			import: `${config.src}browser/bundle.ts`,
			dependOn: "config",
		},
		sw: {
			import: `${config.src}this/handle.ts`,
			dependOn: "config",
			// https://webpack.js.org/configuration/output/#outputlibrary
			library: {
				name: "handle",
				type: "self",
				export: "default",
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: "esbuild-loader",
				exclude: /node_modules/,
			},
		],
	},
	plugins: [new BundleAnalyzerPlugin()],
	output: {
		filename: "aero.[name].js",
		path: path.resolve(__dirname, "dist/sw"),
		clean: true,
	},
	optimization: config.split
		? {
				splitChunks: {
					chunks: "all",
					minSize: 0,
				},
		  }
		: {},
	resolve: {
		extensions: [".ts"],
		plugins: [new TsconfigPathsPlugin()],
	},
	experiments: {
		outputModule: true,
	},
};
