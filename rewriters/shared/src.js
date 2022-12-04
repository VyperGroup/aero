// Module only
import * as config from "../../config.js";

if (typeof $aero === "undefined")
	var $aero = {
		config: config,
	};

$aero.rewriteSrc = url => {
	if (/^(about:|data:|javascript:)/g.test(url)) return url;

	if (url === null) {
		console.error("Nullish value passed to the src rewriter");

		return url;
	}

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
