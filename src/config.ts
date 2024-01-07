const config: AeroTypes.config = {
	prefix: "/go/", 
  aeroExcludePaths: ["aero.config.js", "uv.config.js", "aero.sandbox.ts"], // This can be done better
	bareServers: ["/bare/"],
	webrtcTurnServers: ["stun:stun.l.google.com:19302"],
	bareSort: {
	  interval: number
	  type:  
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
