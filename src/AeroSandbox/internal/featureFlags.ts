import type {
	FeatureFlagsRuntime
} from "../../../types/featureFlags";
import { boolFlag } from "$aero/build/featureFlags";

export default {
	// JS Rewriter
	INCLUDE_AST_PARSER_SEAFOX: boolFlag(false),
	INCLUDE_AST_PARSER_OXC: boolFlag(false),
	INCLUDE_AST_WALKER_TRAVERSE_THE_UNIVERSE: boolFlag(false),
	HTML_REWRITER_MODE: "custom-elements",
	HTML_USE_IS_ATTR: boolFlag(false),
	HTML_USE_NAV_EVENTS: boolFlag(false),
	DEBUG: boolFlag(false)
} as FeatureFlagsRuntime;,
