const aeroPrefix = "/aero/";
const prefix = "/go/";
const proxyApi = "/fetch";
const proxyApiWs = "/fetchWs";

const dynamicConfig = {
	// The database name
	dbName: "aero",
	// Id to differentiate message from other purposes
	id: "updateConfig",
};

// For experimental features
const flags = {
	safariSupport: false, // Safari has limited support of SW, so there may be some workarounds
	legacy: true, // Recommended
	nonstandard: true, // Recommended
	misc: true, // Experimental features that haven't been tested, and aren't significant enough to earn a flag
	dynamicConfig: false, // May impair performance
	advancedScoping: false, // May impair performance
	corsEmulation: false, // Not finished
	nestedWorkers: false, // Not finished
	wrtc: false, // Not finished
};

// Ignore these if you are not a programmer
const debug = {
	url: false,
	src: false,
	scoping: false,
};

export {
	aeroPrefix,
	prefix,
	proxyApi,
	proxyApiWs,
	dynamicConfig,
	flags,
	debug,
};
