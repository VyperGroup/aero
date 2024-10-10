import type { boolFlagType, QuotedString } from "../types/featureFlags";

import type { htmlRewriterMode } from "../types/rewriters/html";

export interface FeatureFlags {
	INCLUDE_AST_PARSER_SEAFOX: boolFlagType;
	/** @warning currently unsupported */
	INCLUDE_AST_PARSER_OXC: boolFlagType;
	INCLUDE_AST_WALKER_TRAVERSE_THE_UNIVERSE: boolFlagType;
	/** @warning `custom_elements` is currently unsupported */
	SUPPORTED_HTML_REWRITER_MODES: string;
	/** @warning currently unsupported */
	HTML_USE_IS_ATTR: boolFlagType;
	/** @warning currently unsupported */
	HTML_USE_NAV_EVENTS: boolFlagType;
	/** @warning currently unsupported */
	FEATURE_EMU_SECURE_CONTEXT: boolFlagType;
	/**
	 * TODO: This will make the URL proceed after the hash, evading all peeping by extension filters.
	 * @warning currently unsupported */
	FEATURE_HASH_URL: boolFlagType;
	DEBUG: boolFlagType;
}

export interface FeatureFlagsRuntime extends FeatureFlags {
	// JS Rewriter
	INCLUDE_AST_PARSER_SEAFOX: boolFlagType;
	/** @warning currently unsupported */
	INCLUDE_AST_PARSER_OXC: boolFlagType;
	INCLUDE_AST_WALKER_TRAVERSE_THE_UNIVERSE: boolFlagType;
	/** @warning `custom_elements` is currently unsupported */
	HTML_REWRITER_MODE: htmlRewriterMode;
	/** @warning currently unsupported */
	HTML_USE_IS_ATTR: boolFlagType;
	/** @warning currently unsupported */
	HTML_USE_NAV_EVENTS: boolFlagType;
	DEBUG: boolFlagType;
}

export function boolFlag(bool: boolean): boolFlagType {
	return bool ? "true" : "false";
}
