/** @import { Config } from "aero-sandbox" */

/**
 * @type {Config}
 */
const defaultConfig = {
	globalNamespace: "$aero",
	bundles: {
		main: "./sandbox.aero.js",
		swAdditions: "./swAdditions.aero.js",
		// APIs
		nestedSWs: "./nestedSWs.aero.js",
		storageIsolator: "./storageIsolator.aero.js",
		// Extra APIs (do not include these if you are making a SW proxy)
		ControlViews: "./ControlViews.aero.js"
	},
	webrtcTurnServers: ["stun:stun.l.google.com:19302"],
	htmlSandboxElementName: "aero-html-sandbox",
	rewriters: {
		jsLib: self.JSRewriter,
		html: {
			lib: self.HTML,
			htmlRewriterMode: "custom_elements"
		}
	}
};

export default defaultConfig;
