import type {
	SupportEnum,
	InterceptionFeaturesEnum as InterceptionFeatures
} from "$types/apiInterceptors.d.ts";

/* These ExtraAPIs may require other APIs to be enabled, and it will warn that AeroSandbox wasn't able to build with them if you don't have the correct APIs; pay attention to the descriptions on the fields of this interface */
export enum ExtraAPIs {
	/* Do not enable this API */
	SWLess,
	/* Do not enable this API */
	Faker,
	StorageIsolator,
	CustomViews
}

// TODO: INCLUDE EVERY API INTERCEPTOR THAT IS IN AERO SANDBOX
export enum APIBitwiseEnum {}

export type AeroSandboxFeaturesConfig = {
	supports?: SupportEnum;
	apiIncludeBitwiseEnum?: APIBitwiseEnum | "all";
	apiExcludeBitwiseEnum?: APIBitwiseEnum | "none";
	specialInterceptionFeatures?: InterceptionFeatures;
};

// TODO: Deprecate this
export type AeroSandboxBuildConfig = {
	/** These enum members enable code inside of the Proxy handler that provide other things you may want to use AeroSandbox for */
	extraAPIs: ExtraAPIs;
	proxyGlobalContext: "$aero";
	featureConfig: AeroSandboxFeaturesConfig;
};

// This is the typical proxy config. This is only what is used to format and unformat urls. I forgot what this was used for.
export type ProxyConfig = {
	BareTransport: BareTransport;
	prefix: string;
	encodeUrl: (url: string) => string;
	decodeUrl: (url: string) => string;
	// This is for WebRTC proxying. The API is disabled, if this isn't provided.
	webrtcTurnServers?: string[];
};
