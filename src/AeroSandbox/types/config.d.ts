import type { FeatureFlagsRuntime } from "../../../types/featureFlags";
import type JSRewriter from "$sandbox/JS/JSRewriter";

export type Config = {
	prefix: string;
	webrtcTurnServers: string[];
	/** This property is for Custom Elements "is" rewriting */
	htmlSandboxElementName: string;
	/** This is the runtime version that the user (through the Dynamic Config system if used) or site hoster can use to disable features in aero. Keep in mind these won't be tree shook out. **/
	featureFlags: FeatureFlagsRuntime;
	rewriters: {
		js: JSRewriter;
		html: {
			htmlRewriterMode;
			ignoreClasses: string[];
		};
	};
};
