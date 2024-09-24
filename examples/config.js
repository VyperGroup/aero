/** @import { Config } from "aero-proxy" */

const escapeKeyword = "_";

/**
 * @type {Config}
 */
self.config = {
	bc: new BareMux(),
	prefix: "/go/",
	pathToInitialSW: "/sw.js",
	bundles: {
		"bare-mux": "/aero/BareMux.aero.js",
		handle: "/aero/sw.aero.js",
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
	urlDecoder: url => url
};
