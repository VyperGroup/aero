const prefix = "/go/";
// The name of the folder aero is hosted on
const aeroPrefix = "/aero/";

// If you are using bare, make sure to include the full origin
const backends = ["/bare/"];
/*
I recommend using the TURN servers from https://www.metered.ca/tools/openrelay/, or hosting your own with https://github.com/coturn/coturn
By default the STUN server here won't proxy your connections
*/
const wrtcBackends = ["stun:stun.l.google.com:19302"];
// Time to resort backends
const sortInterval = 0;

const cacheKey = "httpCache";

let ignoreClass;

const dynamicConfig = {
	// The database name
	dbName: "aero",
	// Id to differentiate message from other purposes
	id: "update",
};

const flags = {
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
};

// Ignore these if you are not debugging
const debugMode = true;
const debug = {
	errors: debugMode,
	url: debugMode,
	src: debugMode,
	scoping: debugMode,
};

export {
	aeroPrefix,
	prefix,
	backends,
	wrtcBackends,
	sortInterval,
	cacheKey,
	ignoreClass,
	dynamicConfig,
	flags,
	debug,
};
