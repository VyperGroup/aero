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

	try {
		var proxyUrl = new URL(rawProxyUrl);
	} catch (err) {
		console.error(`Error parsing url for src: ${rawProxyUrl}`);
		return url;
	}

	let rewrittenUrl = url
		// /
		.replace(/^(\/)/g, $aero.config.prefix + proxyUrl.origin + "/")
		// ./
		.replace(/^(\.\/)/g, proxyUrl.hostname.origin);

	// Protocol
	if (/^(https?:\/\/)/g.test(rewrittenUrl))
		rewrittenUrl = $aero.config.prefix + rewrittenUrl;

	if ($aero.config.debug.src) console.info(`${url} -> ${rewrittenUrl}`);

	return rewrittenUrl;
};

export default $aero.rewriteSrc;
