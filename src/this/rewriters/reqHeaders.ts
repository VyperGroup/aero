import type { BareHeaders } from "@tomphttp/bare-client";

import { rewriteGetCookie } from "shared/cookie";
import { rewriteAuthClient } from "./auth";

import afterPrefix from "shared/afterPrefix";

/**
 * Rewrites the response headers
 * @return The rewritten headers
 */
export default (headers: object, proxyUrl: URL): BareHeaders => {
	const rewrittenHeaders = {};

	Object.keys(headers).forEach(key => {
		function set(val: string) {
			rewrittenHeaders[key] = val;
		}

		const val = headers[key];

		if (key === "host") set(proxyUrl?.host);
		else if (key === "origin") set(proxyUrl?.origin);
		else if (key === "referrer") set(afterPrefix(val));
		// TODO: Ignore commas inside of quotes
		else if (key === "cookie") set(rewriteGetCookie(val, proxyUrl));
		else if (key === "authenticate") rewriteAuthClient(val, proxyUrl);
		else if (!key.startsWith("x-aero")) set(val);
	});

	return rewrittenHeaders;
};
