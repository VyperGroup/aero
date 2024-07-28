import sharedConfig from "./sharedConfig";

import { proxyLocation } from "./proxyLocation";

/**
 * This should not be used for processed html attributes, rather rewriteSrcHtml
 * @param - The url to rewrite
 */
function rewriteSrc(url: string, proxyHref = proxyLocation().href): string {
	// Protocol
	const rewroteUrl = /^(https?:\/\/)/g.test(url)
		? sharedConfig("prefix") + url
		: new URL(url, proxyHref).href;

	return rewroteUrl;
}

export default rewriteSrc;
