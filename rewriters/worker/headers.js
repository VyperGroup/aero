import { prefix, flags } from "../../config.js";

// Rewriters
import { rewriteSetCookie } from "../shared/cookie.js";
import rewriteSrc from "../shared/src.js";

const ignoredHeaders = [
	"cache-control",
	"content-encoding",
	"content-length",
	"cross-origin-opener-policy",
	"cross-origin-opener-policy-report-only",
	"report-to",
	"strict-transport-security",
	"x-content-type-options",
	"x-frame-options",
];

/**
 * Rewrites the location header
 * @param {object} The url
 * @return {string} The url pointed to the proxified url
 */
function rewriteLocation(url) {
	// TODO: Use rewriteSrc
	const rewrite = self.location.origin + prefix + url;

	return rewrite;
}

/**
 * Rewrites the headers
 * @param {object} The headers
 * @return {string} The rewritten headers
 */
export default headers => {
	const rewrittenHeaders = {};

	Object.keys(headers).forEach(key => {
		const deleteHeader = ignoredHeaders.includes(key);

		if (
			deleteHeader ||
			(!flags.corsEmulation && key === "content-security-policy")
		)
			return;

		const value = headers[key];

		if (key === "location") rewrittenHeaders[key] = rewriteLocation(value);
		else if (key === "cookie")
			rewrittenHeaders[key] = rewriteGetCookie(value);
		else if (key === "set-cookie")
			rewrittenHeaders[key] = rewriteSetCookie(value);
		else rewrittenHeaders[key] = value;
	});

	return rewrittenHeaders;
};
