const config: AeroTypes.config = {
	prefix: "/go/",
	aeroPathFilter: path =>
		["aero.config.js", "uv.config.js", "aero.sandbox.ts"].includes(path), // This is probably wrong
	webrtcTurnServers: ["stun:stun.l.google.com:19302"],
	urlEncoder: () => {},
	cacheKey: "httpCache",
	dynamicConfig: {
		dbName: "aero",
		id: "update",
	},
	flags: {
		// Emulation
		emulateSecureContext: false,
		corsEmulation: true,
		// Support options
		legacy: true,
		experimental: true,
		nonstandard: true,
		// Stealth
		foolExtensions: false,
		// Aero Sandbox options
		concealNamespace: true,
	},
	debugMode: true,
	debug: {
		errors: true,
		url: true,
		src: true,
		scoping: true,
	},
};

export default config;
