//import { rewriteGetCookie } from "$sandbox/shared/cookie";
import { rewriteAuthClient } from "./auth";
import { afterPrefix } from "$sandbox/shared/getProxyUrl";

export default (headers: Headers, proxyUrl: URL): void => {
	for (const [key, value] of headers.entries()) {
		if (key === "host") headers.set(key, proxyUrl?.host);
		else if (key === "origin") headers.set(key, proxyUrl?.origin);
		else if (key === "referrer") headers.set(key, afterPrefix(value));
		// TODO : Ignore commas inside of quotes
		/*else if (key === "cookie")
			headers.set(key, rewriteGetCookie(value, proxyUrl));*/ else if (
			key === "authenticate"
		)
			rewriteAuthClient(value, proxyUrl);
		else if (!key.startsWith("x-aero")) headers.set(key, value);
	}
};
