// Config types

/**
 * Interface for BareSort.
 * This interface is used to define the structure of BareSort.
 */
interface BareSort {
	/** checkInterval: Can be a number or false. If false, it disables the check interval. */
	checkInterval: number | false;
	/** sorter: A function that takes an array of endpoints and returns a sorted array of endpoints. */
	sorter: (endpoints: string[]) => string[];
}

/** aeroPathFilter: A function that modifies the request path. */
type aeroPathFilter = (reqPath: string) => boolean;

declare namespace AeroTypes {
	/**
	 * GlobalAeroCTX interface.
	 * This interface is not in AeroSandbox because it is initialized inside of handle.ts.
	 * It might be better to make a separate type for $aero inside of the sandbox library.
	 */
	export interface GlobalAeroCTX {
		// TODO: Define properties here
	}

	/**
	 * config interface.
	 * This interface is used to define the configuration options for Aero.
	 */
	export interface config {
		/** prefix: The prefix for the URL. */
		prefix: string;
		/** aeroPathFilter: These files are excluded from import because they are needed for aero to function. */
		aeroPathFilter: aeroPathFilter;
		/** bareServers: The backends to use. */
		bareServers: string[];
		/** webrtcTurnServers: The WebRTC backends to use. */
		webrtcTurnServers: string[];
		bareSort: BareSort;
		/** sortInterval: Time to fallback to backends. */
		sortInterval: number;
		/** cacheKey: The cache key to use. */
		cacheKey: string;
		/** aeroScopingType: Import scoping.ts rather than gel.ts when it is set to gel. */
		aeroScopingType: "gel" | "scoping"; // TODO: Import scoping.ts rather than gel.ts when it is set to gel
		/** dynamicConfig: The dynamic configuration. */
		dynamicConfig?: {
			/** dbName: The database name. */
			dbName: string;
			/** id: Id to differentiate message from other purposes. */
			id: string;
		};
		/** flags: The flags for various features, security options, support options, protocol support, and misc options. */
		flags: {
			// Features
			sortBackends: boolean;
			dynamicUpdates: boolean;
			// Security
			emulateSecureContext: boolean /** emulateSecureContext: Trick the site into thinking it has SSL */;
			corsCompliance: boolean /** corsCompliance: Obey security features, rather than ignore them; Recommended */;
			// AeroSandbox support options
			legacy: boolean /** legacy: Enable support for deprecated features; Recommended */;
			experimental: boolean /** experimental: Enable features that aren't widely adopted by the 3 major browsers or in Draft; Recommended */;
			nonstandard: boolean; // Browser-specific code; Recommended
			concealNamespace: boolean /** This is to prevent sites from detecting the proxy by searching for $aero */;
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
	export interface Sec {
		clear: string[];
		timing: string;
		permsFrame: string;
		perms: string;
		frame: string;
		csp: string;
	}
}
