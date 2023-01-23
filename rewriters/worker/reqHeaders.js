// Rewriters
import { rewriteGetCookie } from "../shared/cookie.js";

/**
 * Rewrites the response headers
 * @param {object}
 * @param {string}
 * @param {RegExp}
 * @return {string} The rewritten headers
 */
export default (headers, proxyUrl, afterPrefix) => {
	const rewrittenHeaders = {};

	Object.keys(headers).forEach(key => {
		const value = headers[key];

		if (key === "host") rewrittenHeaders[key] = proxyUrl?.host;
		else if (key === "origin") rewrittenHeaders[key] = proxyUrl?.origin;
		else if (key === "referrer") rewrittenHeaders[key] = afterPrefix(value);
		else if (key === "cookie")
			rewrittenHeaders[key] = rewriteGetCookie(value);
		else rewrittenHeaders[key] = value;
	});

	return rewrittenHeaders;
};
