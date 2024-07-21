import config from "$aero_config";
const { prefix, debug } = config;

/**
 * This should not be used for processed html attributes, rather rewriteSrcHtml
 * @param - The url to rewrite
 * @param - The url to rewrite
 */
function rewriteSrc(url: string, proxyHref: string): string {
	// Protocol
	const rewroteUrl = /^(https?:\/\/)/g.test(url)
		? prefix + url
		: prefix + new URL(url, proxyHref).href;

	if (debug.src) console.info(`${url} ➜ ${rewroteUrl}`);

	return rewroteUrl;
}

export default rewriteSrc;
