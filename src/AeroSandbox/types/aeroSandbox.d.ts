import type {
	SupportEnum,
	InterceptionFeaturesEnum as InterceptionFeatures
} from "$types/apiInterceptors";

/* These ExtraAPIs may require other APIs to be enabled, and it will warn that AeroSandbox wasn't able to build with them if you don't have the correct APIs; pay attention to the descriptions on the fields of this interface */
enum ExtraAPIs {
	/* Do not enable this API */
	SWLess,
	/* Do not enable this API */
	Faker,
	StorageIsolator,
	CustomViews
}

export interface AeroSandboxConfig {
	proxyConfig: ProxyConfig;
	/** These enum members enable code inside of the Proxy handler that provide other things you may want to use AeroSandbox for */
	specialInterceptionFeatures?: InterceptionFeatures;
	supports: SupportEnum;
	extraAPIs: ExtraAPIs;
	proxyGlobalContext: "$aero";
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
