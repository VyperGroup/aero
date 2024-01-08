// Config types

interface BareSort {
	checkInterval: number | false; // Return false to disable
	sorter: (endpoints: string[]) => string[]; // // A modifer that returns a sorted array of endpoints
}

type aeroExcludePaths = (reqPath: string) => boolean; // A modifer

declare namespace AeroTypes {
	// This isn't in AeroSandbox, because it is initialized inside of handle.ts
	// TODO: I might make a seperate type for $aero inside of the sandbox library, because by then the security variables are set. Besides, I doubt that AeroTypes works in the scope of AeroSandbox.
	export interface GlobalAeroCTX {
		// TODO: ...(define properties)
	}

	export interface config {
		prefix: string; // The prefix for the URL// The prefix for the URL
		aeroExcludePaths: aeroExcludePaths; // The array of these files are exluded from import, because they are needed to be imported for aero to function.
		bareServers: string[]; // The backends to use
		webrtcTurnServers: string[]; // The WebRTC backends to use
		bareSort: BareSort;
		sortInterval: number; // Time to fallback to backends
		cacheKey: string; // The cache key to use
		// The dynamic configuration
		dynamicConfig: {
			dbName: string; // The database name
			id: string; // Id to differentiate message from other purposes
		};
		// The flags
		flags: {
			// Features
			sortBackends: boolean;
			dynamicUpdates: boolean;

			// Security
			emulateSecureContext: boolean; // Secure-only features would still be broken; this is only to mask the site as secure
			corsEmulation: boolean; // Obey security features, rather than ignore them; Recommended
			// AeroSandbox support options
			legacy: boolean;
			experimental: boolean; // Enable features that arent widely adopted by the 3 major browser  or in Draft
			nonstandard: boolean; // Browser-specific code. Recommended

			// Protocol support
			wrtc: boolean;
			ws: boolean;

			// Misc
			concealNamespace: boolean; // This is to prevent sites from detecting the proxy by searching for $aero
			foolExtensions: boolean; // Prevent extensions from blocking by checking the request url

			workers: boolean;
		};
		// Ignore these if you are not debugging
		debugMode: boolean;
		debug: {
			errors: boolean;
			url: boolean;
			src: boolean;
			scoping: boolean;
		};
	}
	export interface Sec {
		clear: string[];
		timing: string;
		permsFrame: string;
		perms: string;
		frame: string;
		csp: string;
	}
}
