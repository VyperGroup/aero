import { htmlRewriterMode } from "./rewriters/html";

import type JSRewriter from "$sandbox/JS/JSRewriter";

export type Config = {
	prefix: string;
	webrtcTurnServers: string[];
	/** This property is for Custom Elements "is" rewriting */
	htmlSandboxElementName: string;
	/** This is the runtime version that the user (through the Dynamic Config system if used) or site hoster can use to disable features in aero. Keep in mind these won't be tree shook out. **/
	featureFlags;
};
