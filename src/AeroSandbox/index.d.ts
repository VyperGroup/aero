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

declare namespace AeroSandboxTypes {
	export interface $location {
		// TODO: Define
	},
	export type AeroSandboxConfig = {
		ProxyConfig?; // This is not needed, if you are running this on aero itself, since it will automatically have the proper namespace already (no need for mapping).
		proxyLocation: () => URL;
		htmlInterception?: HtmlInterceptionConfig; // Enable Element API inteception and HTML interception
		redirectors?: boolean; // Enable redirectors; default true. Concelears and redirectors are distinct options, because you might be trying to intercept link redirection. See DEV.md.
		concealers?: boolean; // Enable concealers; default true
		jsRewriter?: Function;
		nestedSWSupport: boolean; // This requires that you import the nested SW library into your main SW file
		// Extra features
		FakerAPI?: FakerAPIConfig; // I recommend disabling: redirectors, if you enable it because it would probably not be necessary
		SWlessRuntime?: SWlessRuntimeConfig;
	};
}
