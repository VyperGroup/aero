import { prefix } from "config";

import rewriteSrc from "shared/src";

import scope from "shared/scope";

import { proxyLocation } from "browser/misc/proxyLocation";

/**
 * Extends src rewriting for processed html urls
 * @param - The url to rewrite
 * @param - If its to rewrite an iFrame src
 */
export default (src: string, isIFrame?: boolean): string => {
	const url = globalThis.$aero.proto.get(
		src.replace(new RegExp(`^(${location.origin})`, "g"), "")
	);

	if (/^javascript:/g.test(url)) return scope(url);
	if (/^data:/g.test(url)) {
		if (isIFrame) {
			const exp = /^data:text\/html(;base64)?,/g;

			const matches = [...url.matchAll(exp)];

			if (matches.length === 2)
				return matches[0].replace(
					exp,
					"$&" +
						encodeURIComponent(
							globalThis.$aero.init + decodeURIComponent(url)
						)
				);
			if (matches.length === 1)
				return "$&" + btoa(globalThis.$aero.init + atob(url));
		}
		return url;
	}
	if (
		// Ignore about:blank
		/^about:/g.test(url) ||
		// Don't rewrite again
		new RegExp(`^(${prefix})`).test(url)
	)
		return url;

	return rewriteSrc(url, proxyLocation().href);
};
