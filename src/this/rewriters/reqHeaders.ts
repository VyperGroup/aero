import type { BareHeaders } from "@tomphttp/bare-client";

import { rewriteGetCookie } from "shared/cookie";

import afterPrefix from "shared/afterPrefix";

/**
 * Rewrites the response headers
 * @return The rewritten headers
 */
export default (headers: object, proxyUrl: URL): BareHeaders => {
	const rewrittenHeaders = {};

	Object.keys(headers).forEach(key => {
		function set(val: string): void {
			rewrittenHeaders[key] = val;
		}

		const value = headers[key];

		if (key === "host") set(proxyUrl?.host);
		else if (key === "origin") set(proxyUrl?.origin);
		else if (key === "referrer") set(afterPrefix(value));
		else if (key === "cookie") set(rewriteGetCookie(value, proxyUrl));
		else if (!key.startsWith("x-aero")) set(value);
	});

	return rewrittenHeaders;
};
