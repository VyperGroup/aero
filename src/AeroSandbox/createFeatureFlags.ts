import { type FeatureFlags, boolFlag } from "./build/featureFlags";

interface Context {
	debugMode: boolean;
}

export default (ctx: Context) =>
	({
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
		DEBUG: boolFlag(ctx.debugMode)
	}) as FeatureFlags;
