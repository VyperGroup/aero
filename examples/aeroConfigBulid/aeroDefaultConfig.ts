// This is an example; obviously tweak it to suit your needs

import { boolFlag } from "aero-proxy/featureFlags";
import type { Config } from "aero-proxy/configTypes";

// @ts-ignore
import BareMux from "@mercuryworkshop/bare-mux";

declare const self: WorkerGlobalScope &
	typeof globalThis & {
		config: Config;
	};

const escapeKeyword = "_";

self.config = {
	bc: new BareMux(),
	prefix: "/go/",
	pathToInitialSW: "/sw.js",
	bundles: {
		config: "/aero/config.aero.js",
		sandbox: "/aero/sandbox/sandbox.aero.js"
	},
	aeroPathFilter: path =>
		Object.values(self.config.bundles).find(bundlePath =>
			path.startsWith(bundlePath)
		) === null ||
		path.startsWith("/tests/") ||
		path.startsWith("/baremux") ||
		path.startsWith("/epoxy/") ||
		!path.startsWith(self.config.prefix),
	searchParamOptions: {
		referrerPolicy: {
			escapeKeyword,
			searchParam: "passthroughReferrerPolicy"
		},
		isModule: {
			escapeKeyword,
			searchParam: "isModule"
		},
		integrity: {
			escapeKeyword,
			searchParam: "integrity"
		}
	},
	cacheKey: "httpCache",
	dynamicConfig: {
		dbName: "aero",
		id: "update"
	},
	urlEncoder: url => url,
	urlDecoder: url => url,
	htmlSandboxElementName: "aero-html-sandbox",
	featureFlags: {
		FEATURE_URL_ENC: boolFlag(false),
		FEATURE_CORS_TESTING: boolFlag(false),
		FEATURE_CORS_EMULATION: boolFlag(false),
		FEATURE_INTEGRITY_EMULATION: boolFlag(false),
		FEATURE_ENC_BODY_EMULATION: boolFlag(false),
		FEATURE_CACHES_EMULATION: boolFlag(false),
		FEATURE_CLEAR_EMULATION: boolFlag(false),
		REWRITER_HTML: boolFlag(true),
		CUSTOM_ELEMENTS_USE: "custom_elements_sandbox",
		REWRITER_XSLT: boolFlag(false),
		REWRITER_JS: boolFlag(false),
		REWRITER_CACHE_MANIFEST: boolFlag(false),
		SUPPORT_LEGACY: boolFlag(false),
		SUPPORT_WORKER: boolFlag(false),
		DEBUG: boolFlag(false)
	}
};
