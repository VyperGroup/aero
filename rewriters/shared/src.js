// Module only
import * as config from "../../config.js";

if (typeof $aero === "undefined")
	var $aero = {
		config: config,
	};

/**
 * This should not be used for processed html attributes, rather rewriteSrcHtml
 * @param {string} - The url to rewrite
 */
$aero.rewriteSrc = url => {
	const rawProxyUrl =
		location.pathname.replace(new RegExp(`^(${$aero.config.prefix})`), "") +
		location.search;

	var proxyUrl = new URL(rawProxyUrl);

	// Prepare first part
	let rewrittenUrl = url
		// /
		.replace(/^(\/)/g, $aero.config.prefix + proxyUrl.origin + "/")
		// ./
		.replace(/^(\.\/)/g, $aero.config.prefix + proxyUrl.href.split("/").slice(0,-1).join("/") + "/");

	// Protocol
	if (/^(https?:\/\/)/g.test(rewrittenUrl))
		rewrittenUrl = $aero.config.prefix + rewrittenUrl;

	if ($aero.config.debug.src) console.info(`${url} -> ${rewrittenUrl}`);

	return rewrittenUrl;
};

export default $aero.rewriteSrc;
