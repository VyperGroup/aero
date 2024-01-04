// TODO: Convert to TS
const config = {
	prefix: "/go/", // The prefix for the URL// The prefix for the URL
	aeroPrefix: "/aero/", // The name of the folder aero is hosted on
	bareServers: ["/bare/"], // The backends to use
	webrtcTurnServers: ["stun:stun.l.google.com:19302"], // The WebRTC backends to use
	sortInterval: 0, // Time to fallback to backends
	cacheKey: "httpCache", // The cache key to use
	// The dynamic configuration
	dynamicConfig: {
		dbName: "aero", // The database name
		id: "update", // Id to differentiate message from other purposes
	},
	// The flags
	flags: {
		// Features
		sortBackends: true,
		dynamicUpdates: false,

		// Security
		emulateSecureContext: false, // Secure-only features would still be broken; this is only to mask the site as secure
		corsEmulation: true, // Obey security features, rather than ignore them; Recommended

		// Support
		safari: false, // Safari has limited support of SWs, so there may be some workarounds
		legacy: true,
		experimental: true, // Code that isn't widely adopted (by the 3 major browsers), or in Draft
		nonstandard: true, // Browser-specific code. Recommended
		misc: false, // Experimental features that haven't been tested, and aren't significant enough to earn a flag

		// Protocol support
		wrtc: true,
		ws: true,

		// Misc
		concealNamespace: true, // This is to prevent sites from detecting the proxy by searching for $aero
		foolExtensions: false, // Prevent extensions from blocking by checking the request url

		workers: true,
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
