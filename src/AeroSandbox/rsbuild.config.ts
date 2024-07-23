// TODO: Fix import
import { defineConfig, DefinePlugin } from "@rsbuild/core";

export default defineConfig({
	plugins: [
		new DefinePlugin({
			INCLUDE_AEROGEL_MINIMAL: JSON.stringify(false),
			INCLUDE_ESNIFF: JSON.stringify(true),
			INCLUDE_AST_PARSER_SEAFOX: JSON.stringify(true),
			INCLUDE_AST_PARSER_OXC: JSON.stringify(false),
			INCLUDE_AST_WALKER_TRAVERSE_THE_UNIVERSE: JSON.stringify(true),
		}),
	],
});
