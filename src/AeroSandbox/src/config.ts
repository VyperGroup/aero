import { boolFlag } from "$aero/build/featureFlags";
import type { Config } from "$types/config";

import JSRewriter from "./sandboxers/JS/JSRewriter";

// TODO: Init

const jsRewriter = new JSRewriter();

const config: Config = {
	webrtcTurnServers: ["stun:stun.l.google.com:19302"],
	htmlSandboxElementName: "aero-html-sandbox",
	featureFlags: {
		// JS Rewriter
		INCLUDE_AST_PARSER_SEAFOX: boolFlag(false),
		INCLUDE_AST_PARSER_OXC: boolFlag(false),
		INCLUDE_AST_WALKER_TRAVERSE_THE_UNIVERSE: boolFlag(false),
		HTML_REWRITER_MODE: "custom-elements",
		HTML_USE_IS_ATTR: boolFlag(false),
		HTML_USE_NAV_EVENTS: boolFlag(false),
		DEBUG: boolFlag(false)
	}
};

export default config;
