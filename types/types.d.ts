import type BareClient from "@mercuryworkshop/bare-mux";
import type { AeroLogger } from "$aero_sandbox/src/shared/genBubbleStyle.ts";

type AeroPathFilter = (reqPath: string) => boolean;
type UrlEncoder = (url: string) => string;

/**
 * GlobalAeroCTX interface.
 * This interface is not in AeroSandbox because it is initialized inside of handle.ts.
 * It might be better to make a separate type for $aero inside of the sandbox library.
 */
interface GlobalAeroCTX {
	[x: string]: any;
	// TODO: Define properties here
	sec: Sec;
	bc: BareClient;
}

/**
 * config interface.
 * This interface is used to define the configuration options for Aero.
 */
interface Config {
	/** aeroPathFilter: These files are excluded from import because they are needed for aero to function. */
	aeroPathFilter: AeroPathFilter;
	/** prefix: The prefix for the URL. */
	prefix: string;
	/** sortInterval: Time to fallback to backends. */
	sortInterval: number;
	/** cacheKey: The cache key to use. */
	cacheKey: string;
	/** dynamicConfig: The dynamic configuration. */
	dynamicConfig?: {
		/** dbName: The database name. */
		dbName: string;
		/** id: Id to differentiate message from other purposes. */
		id: string;
	};
	aeroSandbox: {
		jsParserConfig: AeroJSParserConfig;
		/** backendURLs: TODO: Describe... */
		backendURLs: string[];
		/** webrtcTurnServers: The WebRTC backends to use. */
		webrtcTurnServers: string[];
		bareSort: BackendURLSort;
		/** hashUrl: TODO: This will make the URL proceed after the hash, evading all peeping by extension filters. */
		hashUrl: boolean;
		swLess: boolean;
		urlEncoder: UrlEncoder;
	};
	/* TODO: Switch to Bitwise Enums */
	/** flags: The flags for various features, security options, support options, protocol support, and misc options. */
	flags: {
		// AeroSandbox support options
		legacy: boolean /** legacy: Enable support for deprecated features; Recommended */;
		experimental: boolean /** experimental: Enable features that aren't widely adopted by the 3 major browsers or in Draft; Recommended */;
		nonstandard: boolean; // Browser-specific code; Recommended
		concealNamespace: boolean /** This is to prevent sites from detecting the proxy by searching for $aero */;
		// Features
		sortBackends: boolean;
		dynamicUpdates: boolean;
		// Security
		emulateSecureContext: boolean /** emulateSecureContext: Trick the site into thinking it has SSL. TODO: Include polyfills for APIs that are only supposed to be used in a Secure Context if that Secure Context isn't available. */;
		corsCompliance: boolean /** corsCompliance: Obey security features, rather than ignore them; Recommended */;
		// Extra
		foolExtensions: boolean /* foolExtensions: Prevent extensions from blocking by checking the request url */;
		workers: boolean;
	};
	/** debugMode: Ignore these if you are not debugging. */
	debugMode: boolean;
	debug: {
		errors: boolean;
		url: boolean;
		src: boolean;
		scoping: boolean;
	};
}

/**
 * Sec interface.
 * This interface is used to define the security options.
 */
interface Sec {
	clear: string[];
	timing: string;
	permsFrame: string;
	perms: string;
	frame: string;
	csp: string;
}
