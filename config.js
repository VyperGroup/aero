const aeroPrefix = "/aero/";
const prefix = "/go/";

const cacheKey = "HTTP_";

const backends = ["/fetch"];
const wsBackends = ["/fetchws"];
// Not implemented yet
const wrtcBackends = {
	// I recommend using your TURN servers from https://www.metered.ca/tools/openrelay/
	ice: ["stun:stun.l.google.com:19302"],
};

const dynamicConfig = {
	// The database name
	dbName: "aero",
	// Id to differentiate message from other purposes
	id: "update",
};

// For experimental features
const flags = {
	legacy: true, // Recommended
	nonstandard: true, // Browser-specific code. Recommended
	dynamicUpdates: false, // Recommended
	corsEmulation: true, // Recommended
	wrtc: true, // Recommended
	ws: true, // Recommended
	misc: false, // Experimental features that haven't been tested, and aren't significant enough to earn a flag
	safariSupport: false, // Safari has limited support of SW, so there may be some workarounds
	advancedScoping: true, // May impair performance
	nestedWorkers: false, // Not finished
};

// Ignore these if you are not a programmer
const debug = {
	errors: true,
	url: false,
	src: false,
	scoping: false,
};

export {
	aeroPrefix,
	prefix,
	cacheKey,
	backends,
	wsBackends,
	wrtcBackends,
	dynamicConfig,
	flags,
	debug,
};
