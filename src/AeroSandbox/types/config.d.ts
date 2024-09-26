import type JSRewriter from "$sandbox/JS/JSRewriter";

import { htmlRewriterMode } from "./rewriters/html";

export type Config = {
	bundle: string;
	prefix: string;
	webrtcTurnServers: string[];
	/** This property is for Custom Elements "is" rewriting */
	htmlSandboxElementName: string;
	/** This is the runtime version that the user (through the Dynamic Config system if used) or site hoster can use to disable features in aero. Keep in mind these won't be tree shook out. **/
	rewriters: {
		js: JSRewriter;
		html: {
			htmlRewriterMode;
			ignoreClasses: string[];
		};
	};
};
