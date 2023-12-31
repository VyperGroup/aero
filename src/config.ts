// TODO: Convert to TS
const config = {
	// The prefix for the URL
	prefix: "/go/",
	// The name of the folder aero is hosted on
	aeroPrefix: "/aero/",
	// The backends to use
	bareServers: ["/bare/"],
	// The WebRTC backends to use
	webrtcTurnServers: ["stun:stun.l.google.com:19302"],
	// Time to resort backends
	sortInterval: 0,
	// The cache key to use
	cacheKey: "httpCache",
	// The class to ignore
	ignoreClass: undefined,
	// The dynamic configuration
	dynamicConfig: {
		// The database name
		dbName: "aero",
		// Id to differentiate message from other purposes
		id: "update",
	},
	// The flags
	flags: {
		// Features
		sortBackends: true, // Recommended
		dynamicUpdates: false, // Recommended

		// Security
		emulateSecureContext: false, // Secure-only features would still be broken; this is only to mask the site as secure
		corsEmulation: true, // Obey security features, rather than ignore them; Recommended

		// Support
		safari: false, // Safari has limited support of SWs, so there may be some workarounds
		legacy: true, // Recommended
		experimental: true, // Code that isn't widely adopted (by the 3 major browsers), or in Draft
		nonstandard: true, // Browser-specific code. Recommended
		misc: false, // Experimental features that haven't been tested, and aren't significant enough to earn a flag

		// Protocol support
		wrtc: true, // Recommended
		ws: true, // Recommended

		// Misc
		// This is to prevent sites from detecting the proxy by searching for $aero
		concealNamespace: true,
		// Prevent extensions from blocking by checking the request url
		foolExtensions: false,

		// Incomplete
		workers: false,
	},
	// Ignore these if you are not debugging
	debugMode: true,
	debug: {
		errors: true,
		url: true,
		src: true,
		scoping: true,
	},
};

export default config;
