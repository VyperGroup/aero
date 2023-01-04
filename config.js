const aeroPrefix = "/aero/";
const prefix = "/go/";
const proxyApi = "/fetch";
const proxyApiWs = "/fetchWs";

// For experimental features
const flags = {
	advancedScoping: false,
	corsEmulation: false,
	nestedWorkers: false,
	wrtc: false,
};

const debug = {
	url: false,
	src: false,
	scoping: false,
};

export { aeroPrefix, prefix, proxyApi, proxyApiWs, flags, debug };
