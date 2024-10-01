/** @import { Config } from "aero-sandbox" */

/**
 * @type {Config}
 */
const config = {
	bundles: {
		main: "./sandbox.aero.js",
		swAdditions: "./swAdditions.aero.js",
		// APIs
		nestedSWs: "./nestedSWs.aero.js",
		storageIsolator: "./storageIsolator.aero.js", // TODO: Use storageIsolator internally in AeroSandbox Runtime
		// Extra APIs (do not include these if you are making a SW proxy)
		ControlViews: "./ControlViews.aero.js"
	},
	webrtcTurnServers: ["stun:stun.l.google.com:19302"],
	htmlSandboxElementName: "aero-html-sandbox",
	rewriters: {
		js: self.JSRewriter,
		html: {
			htmlRewriterMode: "custom_elements"
		}
	}
};

export default config;
