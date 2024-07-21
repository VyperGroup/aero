// Config types

// TODO: Provide types for the Presentation API

/// <reference types="websql" />
/// <reference types="webappsec-credential-management" />
/// <reference types="navigation-api-types" />

import type { AeroSandboxLogger } from "$aero/src/shared/Loggers";

import type { BareTransport } from "@mercuryworkshop/bare-mux";

import { InterceptionFeaturesEnum, APIInterceptor } from "$aero/types";

interface AeroGlobalType {
	$sec: {
		csp: string;
		init: string;
	};
	$bc: BareClient;
	logger: AeroSandboxLogger;
}

declare global {
	// biome-ignore lint/style/noVar: <explanation>
	var $aero: AeroGlobalType;
}

// TODO: Make it possible to use the same configuration used in the AeroSandbox constructor in the AeroSandbox WebPack module to remove features in compile-time and be tree-shaken. You could still configure the AeroSandbox instance using the same configuration type at runtime. Still, if you attempt to enable something disabled at compile-time, the compile-time disabled options in the API Interceptor CTX in the proxifiedObjGenFunc handler would not be present even if enabled in the runtime config. In the compile-time config you would also be able to disable APIs from coming with AeroSandbox and use of them would throw an exception with NeverThrow. All of the APIs will be wrapped with NeverThrow.
interface AeroSandboxConfig {
	proxyConfig: ProxyConfig;
	/** These enum members enable code inside of the Proxy handler that provide other things you may want to use AeroSandbox for */
	specialInterceptionFeatures?: InterceptionFeaturesEnum;
	supports: SupportEnum;
	proxyGlobalContext: "$aero";
}

interface proxifiedObjGeneratorContext {
	specialInterceptionFeatures?: InterceptionFeaturesEnum;
}
type proxifiyObjGenerator = (
	ctx: proxifiedObjGeneratorContext
) => Object | void;
type proxifyGetter = (ctx: proxifiedObjGeneratorContext) => any;

type objectPropertyModifier = (ctx: proxifiedObjGeneratorContext) => void;

/** This is a generic type interface used for intersection in other interfaces below */
interface APIInterceptorGeneric {
	/** This object path that excludes global objects and overwrites the property. *AeroSandbox* will also check if it exists in the global context. This is necessary if `proxifiedObjWorkerVersion` is set.
	 * This is done so that if the api is only exposed to the window it will overwrite it on the window object specifically or else it would use self since that is also covered by the global context of windows and workers. THe reason why this is done is because I want an error to be thrown if a window API is mistakingly used in a worker's global scope.
	 * TODO: // Throw an error if globalProp contains "<global context>.<props>"
	 * @warning It will overwrite the entire global scope with your proxified object if you set it to `""`.
	 */
	globalProp: string | "";
	/** These toggle code inside of the Proxy handler that provide other things you may want to use AeroSandbox for */
	specialInterceptionFeatures?: InterceptionFeaturesEnum;
	/** This is if your API Interceptor covers WebSockets, WebTransports, or WebRTC */
	forAltProtocol?: AltProtocolEnum;
	/* Aero uses self.<apiName> to overwrite the proxified object, but if the API is exclusively for the window, it uses window.<apiName> */
	exposedContexts?: ExposedContextsEnum;
	supports?: SupportEnum;
}
type APIInterceptorForProxyObjects = APIInterceptorGeneric & {
	/** This is specifically for objects that use the ES6 Proxy Object or re-implement the API from scratch. proxifiedObjGenFunc is a handler which returns the proxified object depending on the context given, which is determined by how the AeroSandboxBundler class is configured with the config in the constructor.*/
	proxifiedObj?: Object | proxifiyObjGenerator;
};
type APIInterceptorForProxyObjectsInWorker = APIInterceptorGeneric & {
	proxifiedObjWorkerVersion?: Object;
	exposedContexts: anyWorkerEnumMember;
};
type APIInterceptorForProxifiyingGetters = APIInterceptorGeneric & {
	proxifyGetter?: proxifyGetter;
};
type APIInterceptorForModifyingObjectProperties = APIInterceptorGeneric & {
	/** This is for overwriting properties with the `Object` type class  */
	modifyObjectProperty: objectPropertyModifier;
};
// TODO: Make it possible in AeroSandbox to view the API Interceptor and determine if it should be included in AeroSandbox or not with a handler
/** This is what is exported in every API Interceptor. Omitting any of the properties with the Enum type will act as if every member of the Enum is present. */
type APIInterceptor = APIInterceptorForProxyObjects | APIInterceptorForProxyObjectsInWorker | APIInterceptorForProxifiyingGetters | APIInterceptorForModifyingObjectProperties;

// These enums are inspired by the WebIDL spec
enum SupportEnum {
	deprecated,
	nonstandard,
	draft,
	shippingChromium,
	originTrialExclusive,
}
enum ExposedContextsEnum {
	dedicatedWorker,
	sharedWorker,
	audioWorklet,
	animationWorklet,
	layoutWorklet,
	sharedStorageWorklet,
	paintWorklet,
	serviceWorker,
	window,
}
type anyWorkerEnumMember = ExposedContextsEnum.animationWorklet | ExposedContextsEnum.audioWorklet | ExposedContextsEnum.dedicatedWorker | ExposedContextsEnum.layoutWorklet | ExposedContextsEnum.paintWorklet | ExposedContextsEnum.serviceWorker | ExposedContextsEnum.sharedStorageWorklet | ExposedContextsEnum.sharedWorker;
enum AltProtocolEnum {
	webRTC,
	webSockets,
	webTransport,
}

enum InterceptionFeaturesEnum {
	/** This member requires the correct context to be passed down in the proxy's global context */
	corsEmulation,
	/** This member requires the correct context to be passed down in the proxy's global context */
	cacheEmulation,
	privacySandbox,
	/** Using this member adds code to the navigator.serviceWorker API interceptor to support nestedWorkers. If you enable it and don't have the supplementing SW code for it, it gives up on waiting for a message response back and throws an error. **/
	nestedSWs,
	/** This feature is nowhere near being finished; **do not enable** */
	swLess,
	/** Only use this if you aren't using Custom Element "is" interception */
	elementConcealment,
	errorConcealment,
	messageIsolation,
	/** Only use this member if you aren't using it for a regular SW proxy*/
	requestUrlProxifier,
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

export namespace AeroSandboxTypes {
	export enum HTMLRewriterModes {
		DOMParser,exposedContexts?: ExposedContextsEnum;
		MutationObserver,
	}

	// TODO: Define
	export interface $location {}
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
		Support: SupportEnum;
		/**
		 * This is not needed, if you are running this on aero itself, since it will automatically have the proper namespace already (no need for mapping).
		 */
		ProxyConfig: ProxyConfig;
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
				// TODO: Make this an enum instead
				mode: "DOMParser" | "Mutation Observer";
				replaceRedirectorsWithNavigationEvents: {
					/** This will be enabled by default*/
					enabled: boolean;
					/** This is to remove functionality. If this is false, it will try to detect if navigation events are in the browser, and if they are it won't intercept the redirectors, but the code would still be in the bundle. */
					treeShake: boolean;
				};
			};
		};
	};
}
