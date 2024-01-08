const config: AeroTypes.config = {
	prefix: "/go/",
	aeroExcludePaths: path =>
		["aero.config.js", "uv.config.js", "aero.sandbox.ts"].includes(path), // This is probably wrong
	bareServers: ["/bare/"],
	webrtcTurnServers: ["stun:stun.l.google.com:19302"],
	bareSort: {
		interval: false,
		sorter: bareServers => {
			// TODO: Load balance by default and also provide an example function for speed optimization
			return bareServers;
		},
	},
	sortInterval: 0,
	cacheKey: "httpCache",

	dynamicConfig: {
		dbName: "aero",
		id: "update",
	},

	flags: {
		dynamicUpdates: false,

		emulateSecureContext: false,
		corsEmulation: true,

		legacy: true,
		experimental: true,
		nonstandard: true,

		wrtc: true,
		ws: true,

		concealNamespace: true,
		foolExtensions: false,

		workers: true,
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
