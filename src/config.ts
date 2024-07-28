import { boolFlag } from "$src/featureFlags";

import { Config } from "$types/config";

declare const self: WorkerGlobalScope &
	typeof globalThis & {
		config: Config;
	};

self.config = {
	prefix: "/go/",
	pathToInitialSW: "/sw.js",
	bundles: {
		config: "/aero/config.aero.js",
		sandbox: "/aero/sandbox/sandbox.aero.js"
	},
	aeroPathFilter: path =>
		[
			...Object.values(self.config.bundles),
			"/aero/sandbox/config.aero.js"
		].includes(path),
	cacheKey: "httpCache",
	dynamicConfig: {
		dbName: "aero",
		id: "update"
	},
	urlEncoder: url => url,
	urlDecoder: url => url,
	featureFlags: {
		FEATURE_CORS_EMULATION: boolFlag(false),
		FEATURE_INTEGRITY_EMULATION: boolFlag(false),
		FEATURE_ENC_BODY_EMULATION: boolFlag(false),
		FEATURE_CACHES_EMULATION: boolFlag(false),
		FEATURE_CLEAR_EMULATION: boolFlag(false),
		REWRITER_HTML: boolFlag(true),
		REWRITER_XSLT: boolFlag(false),
		REWRITER_JS: boolFlag(true),
		REWRITER_CACHE_MANIFEST: boolFlag(true),
		SUPPORT_LEGACY: boolFlag(false),
		SUPPORT_WORKER: boolFlag(false),
		DEBUG: boolFlag(true)
	}
};
