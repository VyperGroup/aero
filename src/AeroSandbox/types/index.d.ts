// Config types

// TODO: Provide types for the Presentation API

import { InterceptionFeaturesEnum, APIInterceptor } from "$types/index.d";

// TODO: Make it possible to use the same configuration used in the AeroSandbox constructor in the AeroSandbox WebPack module to remove features in compile-time and be tree-shaken. You could still configure the AeroSandbox instance using the same configuration type at runtime. Still, if you attempt to enable something disabled at compile-time, the compile-time disabled options in the API Interceptor CTX in the proxifiedObjGenFunc handler would not be present even if enabled in the runtime config. In the compile-time config you would also be able to disable APIs from coming with AeroSandbox and use of them would throw an exception with NeverThrow. All of the APIs will be wrapped with NeverThrow.

interface AeroSandboxConfig {
  proxyConfig: ProxyConfig;
  /** These enum members enable code inside of the Proxy handler that provide other things you may want to use AeroSandbox for */
  specialInterceptionFeatures?: InterceptionFeaturesEnum;
  supports: SupportEnum;
  proxyGlobalContext: "$aero";
}

// This is the typical proxy config. This is only what is used to format and unformat urls.
type ProxyConfig = {
  BareTransport: BareTransport;
  prefix: string;
  encodeUrl: (url: string) => string;
  decodeUrl: (url: string) => string;
  // If provided, it will prevent the bare/wisp servers from being revealed through fetch. This will also be used for determining the WS server. This is only for proxies.
  proxyEndpoints?: string[];
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

interface SWlessRuntimeConfig {
  enable: boolean;
  // Refer to DEV.md for the options below
  scriptMarker: boolean;
  extendedAPI: boolean;
}

// Bundler types
