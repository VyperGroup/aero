import { SupportEnum, InterceptionFeaturesEnum } from "$types/apiInterceptors";

import type { BareTransport } from "@mercuryworkshop/bare-mux";

export interface AeroSandboxConfig {
	proxyConfig: ProxyConfig;
	/** These enum members enable code inside of the Proxy handler that provide other things you may want to use AeroSandbox for */
	specialInterceptionFeatures?: InterceptionFeaturesEnum;
	supports: SupportEnum;
	proxyGlobalContext: "$aero";
	webpackFeatureConfig: 
}

// This is the typical proxy config. This is only what is used to format and unformat urls.
export type ProxyConfig = {
	BareTransport: BareTransport;
	prefix: string;
	encodeUrl: (url: string) => string;
	decodeUrl: (url: string) => string;
	// This is for WebRTC proxying. The API is disabled, if this isn't provided.
	webrtcTurnServers?: string[];
};
