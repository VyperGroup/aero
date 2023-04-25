const prefix = "/go/";
// The name of the folder aero is hosted on
const aeroPrefix = "/aero/";

const backends = ["/fetch"];
// Don't set these, if you are using bare
const wsBackends = ["/fetchws"];
const wrtcBackends = {
	/*
	I recommend using the TURN servers from https://www.metered.ca/tools/openrelay/, or hosting your own with https://github.com/coturn/coturn
	By default the STUN server here won't proxy your connections
	*/
	ice: ["stun:stun.l.google.com:19302"],
};
// Time to resort backends
const sortInterval = null;

const cacheKey = "httpCache";

const ignoreClass = null;

// AdGuard filter lists
const agLists = [];

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
	recorder: false, // Archive functionality; Only enable this, if you know what your doing

	// Security
	emulateSecureContext: false, // Secure-only features would still be broken; this is only to mask the site as secure
	corsEmulation: true, // Obey security features, rather than ignore them; Recommended

	// Support
	safari: false, // Safari has limited support of SWs, so there may be some workarounds
	legacy: true, // Recommended
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

// Ignore these if you are not a programmer
const debug = {
	errors: true,
	url: true,
	src: false,
	scoping: false,
};

export {
	aeroPrefix,
	prefix,
	backends,
	wsBackends,
	wrtcBackends,
	sortInterval,
	cacheKey,
	ignoreClass,
	agLists,
	dynamicConfig,
	flags,
	debug,
};
