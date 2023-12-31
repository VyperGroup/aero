import { prefix, debug } from "$aero_config";

/**
 * This should not be used for processed html attributes, rather rewriteSrcHtml
 * @param - The url to rewrite
 * @param - The url to rewrite
 */
function rewriteSrc(url: string, proxyHref: string): string {
	// Protocol
	const rewrittenUrl = /^(https?:\/\/)/g.test(url)
		? prefix + url
		: prefix + new URL(url, proxyHref).href;

	if (debug.src) console.info(`${url} ➜ ${rewrittenUrl}`);

	return rewrittenUrl;
}

export default rewriteSrc;
