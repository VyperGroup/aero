import { proxyLocation } from "./proxyLocation";

import config from "../../../config";
const { prefix } = config;

/**
 * This should not be used for processed html attributes, rather rewriteSrcHtml
 * @param - The url to rewrite
 * @param - The url to rewrite
 */
function rewriteSrc(url: string, proxyHref = proxyLocation().href): string {
	// Protocol
	const rewroteUrl = /^(https?:\/\/)/g.test(url)
		? prefix + url
		: prefix + new URL(url, proxyHref).href;

	return rewroteUrl;
}

export default rewriteSrc;
