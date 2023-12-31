import { prefix } from "$aero_config";

import { rewriteSetCookie } from "$aero/shared/cookie";
import { rewriteAuthServer } from "./auth";

const ignoredHeaders = [
	"cache-control",
	"clear-site-data",
	"content-encoding",
	"content-length",
	"content-security-policy",
	"content-security-policy-report-only",
	"cross-origin-resource-policy",
	"cross-origin-opener-policy",
	"cross-origin-opener-policy-report-only",
	"report-to",
	// TODO: Emulate this
	"strict-transport-security",
	"x-content-type-options",
	"x-frame-options",
];

/**
 * Rewrites the location header
 * @param - The url
 * @return - The url pointed to the proxified url
 */
function rewriteLocation(url: string): string {
	return self.location.origin + prefix + url;
}

/**
 * Rewrites the response headers
 * @return The rewritten headers
 */
export default (headers: object, proxyUrl: URL): HeadersInit => {
	const rewrittenHeaders = {};

	rewrittenHeaders["x-headers"] = JSON.stringify({ ...headers });

	Object.keys(headers).forEach(key => {
		function set(val: string) {
			rewrittenHeaders[key] = val;
		}

		if (ignoredHeaders.includes(key)) return;

		const val = headers[key];

		if (key === "location") set(rewriteLocation(val));
		else if (key === "set-cookie") set(rewriteSetCookie(val, proxyUrl));
		else if (key === "www-authenticate") rewriteAuthServer(val, proxyUrl);
		else set(val);
	});

	return rewrittenHeaders;
};
