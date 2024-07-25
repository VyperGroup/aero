import { Dependencies } from "./node_modules/@rspack/core/dist/config/zod.d";
import path from "path";
import rspack from "@rspack/core";

import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

export default {
  mode: process.env.DEBUG ? "development" : "production",
  entry: {
    aerosandbox: {
      import: "./build/init.ts",
      dependsOn: "jsRewriter",
    },
    jsRewriter: {
      import: "./src/sandboxers/JS/JSRewriter.ts",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new RsdoctorRspackPlugin({
      port: 3300,
    }),
    new rspack.DefinePlugin({
      // Webpack Feature Flags
      // JS Rewriter
      INCLUDE_ESNIFF: JSON.stringify(true),
      INCLUDE_AST_PARSER_SEAFOX: JSON.stringify(true),
      INCLUDE_AST_PARSER_OXC: JSON.stringify(false),
      INCLUDE_AST_WALKER_TRAVERSE_THE_UNIVERSE: JSON.stringify(true),
    }),
  ],
  resolve: {
    extensions: [".ts"],
    tsConfigPath: path.resolve(__dirname, "./tsconfig.json"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/[\\/]node_modules[\\/]/],
        use: [
          {
            loader: "builtin:swc-loader",
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name].[hash].aero.js",
    path: path.resolve(__dirname, "dist"),
  },
} as rspack.Configuration;
