import { src, outdir } from "./shared/config";

import exclude from "./exclude";

const path = require("path");

// https://www.rspack.dev/guide/plugin-compat.html
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// TODO: Support WebExtension and CF Workers backends
export default {
  mode: debug ? "development" : "production",
  devtool: debug ? "true" : "source-map",
  entry: {
    config: {
      import: path.join(src, "config.ts"),
    },
    browser: {
      import: path.join(src, "browser/bundle.ts"),
    },
    sw: {
      import: path.join(src, "this/handle.ts"),
      library: {
        name: "$aero_handle",
        type: "var",
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude,
      },
    ],
  },
  plugins: [new BundleAnalyzerPlugin()],
  output: {
    filename: "aero.[name].js",
    path: path.resolve(__dirname, outdir + "sw"),
    clean: true,
  },
  optimization: config.split
    ? {
        splitChunks: {
          chunks: "all",
        },
      }
    : {},
  experiments: {
    topLevelAwait: true,
  },
};
