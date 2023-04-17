const prefix = "/go/";
// The name of the folder aero is hosted on
const aeroPrefix = "/aero/";

const backends = ["/fetch"];
// Don't set these, if you are using bare
const wsBackends = ["/fetchws"];
const wrtcBackends = {
	// I recommend using the TURN servers from https://www.metered.ca/tools/openrelay/, or hosting your own with https://github.com/coturn/coturn
	ice: ["stun:stun.l.google.com:19302"],
};

const cacheKey = "httpCache";

const ignoreClass = null;

const dynamicConfig = {
	// The database name
	dbName: "aero",
	// Id to differentiate message from other purposes
	id: "update",
};

const flags = {
	// Features
	dynamicUpdates: false, // Recommended

	// Security
	emulateSecureContext: false, // Secure-only features would still be broken; this is only to mask the site as secure
	corsEmulation: true, // Recommended

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

	// Incomplete
	JSScoping: false,
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
	cacheKey,
	ignoreClass,
	dynamicConfig,
	flags,
	debug,
};
