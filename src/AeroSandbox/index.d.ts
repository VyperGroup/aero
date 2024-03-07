// Config types

// This is the typical proxy config. This is only what is used to format and unformat urls.
type ProxyConfig = {
	prefix: string;
	encodeUrl: (url: string) => string;
	decodeUrl: (url: string) => string;
	// If provided, it will prevent the bare servers from being revealed through fetch. This will also be used for determining the WS server. This is only for proxies.
	bareServers?: string[];
	// This is for WebRTC proxying. The API is disabled, if this isn't provided.
	webrtcTurnServers?: string[];
};

type HtmlInterceptionConfig = {
	enable?: boolean;
	// In interception proxies, like aero, parameters like integrity and ... are put in the arguments to then be handled by the SW through emulation. This is because the bodies are obviously going to need to be modified, which will go against the integrity, meaning that it has to be checked later on.
	paramsPassthrough?: boolean;
};

type FakerAPIConfig = {
	enable: boolean;
	allowFakerExcludes?: boolean; // default false
};

type SWlessRuntimeConfig = {
	enable: boolean;
	// Refer to DEV.md for the options below
	scriptMarker: boolean;
	extendedAPI: boolean;
};

// TODO: Convert this to bitwise flags and make them settable on the main aero config
enum  { 
			// AeroSandbox support options
			legacy: boolean /** legacy: Enable support for deprecated features; Recommended */;
			experimental: boolean /** experimental: Enable features that aren't widely adopted by the 3 major browsers or in Draft; Recommended */;
			nonstandard: boolean; // Browser-specific code; Recommended
			originTrialOnly: boolean; // Recommended
			
			concealNamespace: boolean /** This is to prevent sites from detecting the proxy by searching for $aero */;\
}

declare namespace AeroSandboxTypes {
	export interface $location {
		// TODO: Define
	}
	// Internal types
	interface EscapeRule {
		// These rules should be applied to per element
		// Attribute to match
		attr: string;
		// Exclusion rules
		mustContain?: string[];
		cannotContain?: string[];
		// Interception methods
		rewriter?: Function;
		emulator?: Function;
	}
	// Bundler types
	export type Config = {
		support
		/**
		 * This is not needed, if you are running this on aero itself, since it will automatically have the proper namespace already (no need for mapping).
		 */
		ProxyConfig?;
		proxyLocation: () => URL;
		htmlInterception?: HtmlInterceptionConfig; // Enable Element API inteception and HTML interception
		redirectors?: boolean; // Enable redirectors; default true. Concelears and redirectors are distinct options, because you might be trying to intercept link redirection. See DEV.md.
		concealers?: boolean; // Enable concealers; default true
		concealVars?: string[]; // This will use a script rewriter to conceal variables other than $aero
		/**
		 * Bias: bias_text[rating.bias[0]],
		 */
		jsRewriter?: Function;
		nestedSWSupport: boolean; // This requires that you import the nested SW library into your main SW file
		// Extra features
		FakerAPI?: FakerAPIConfig; // I recommend disabling: redirectors, if you enable it because it would probably not be necessary
		SWlessRuntime?: SWlessRuntimeConfig;
		rewriters: {
			html: {
				/** DOMParser is be the default */
				mode: "DOMParser" | "Mutation Observer",
				replaceRedirectorsWithNavigationEvents: {
					/** This will be enabled by default*/
					enabled: boolean;
					/** This is to remove functionality. If this is false, it will try to detect if navigation events are in the browser, and if they are it won't intercept the redirectors, but the code would still be in the bundle. */
					treeShake: boolean;
				},
			},
		},
	};
}
