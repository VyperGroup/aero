// For the SW
import * as config from "../config.js";
if (typeof $aero === "undefined")
	var $aero = {
		config,
		proxyLocation: {
			href: null,
		},
	};

/**
 * This should not be used for processed html attributes, rather rewriteSrcHtml
 * @param {string} - The url to rewrite
 * @param {string} - The url to rewrite
 */
$aero.rewriteSrc = (url, proxyUrl = $aero.proxyLocation.href) => {
	// Prepare first part
	let rewrittenUrl = new URL(url, proxyUrl).href;

	// Protocol
	if (/^(https?:\/\/)/g.test(rewrittenUrl))
		rewrittenUrl = $aero.config.prefix + rewrittenUrl;

	if ($aero.config.debug.src) console.info(`${url} ➜ ${rewrittenUrl}`);

	return rewrittenUrl;
};

export default $aero;
