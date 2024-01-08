"use strict";

const path = require("path");

// https://www.rspack.dev/guide/plugin-compat.html
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

import webpackShared from "./shared/webpackShared";

const debug = process.argv.includes("--debug");

/** @type {import('@rspack/cli').Configuration} */
let config = webpackShared;

const __dirname = new URL(".", import.meta.url).pathname;

config = {
  ...config,
  module: {
    rules: [
      {
        ...config.module.rules[0],
        loader: "builtin:swc-loader",
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  output: {
    ...config.output,
    library: {
      name: "$aeroHandle",
      type: "var",
    },
  },
  resolve: {
    tsConfigPath: path.resolve(__dirname, "../tsconfig.json"),
  },
  experiments: {
    ...config.module.experiments,
    rspackFuture: {
      newResolver: true,
      // https://www.rspack.dev/config/experiments.html#experimentsrspackfuturedisabletransformbydefault
      disableTransformByDefault: true,
    },
  },
};

// Rspack does not support ts-loader
if (debug) config.plugins.push(new ForkTsCheckerWebpackPlugin());

module.exports = config;
