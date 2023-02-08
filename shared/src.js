import { prefix, debug } from "../config.js";

// For module scripts
if (typeof $aero === "undefined")
	var $aero = {
		config: {
			prefix: prefix,
			debug: debug,
		},
	};

/**
 * Go a few levels up of the current directory given by the url
 * @param {string} - A url
 * @param {number} - How far up
 */
function levelsDown(url, level) {
	// TODO: Make sure this doesn't go out of bounds (Behind the site domain)
	return url.split("/").slice(0, -level).join("/");
}

$aero.rewriteRelativeUrl = url => {
	const rawProxyUrl =
		location.pathname.replace(new RegExp(`^(${$aero.config.prefix})`), "") +
		location.search;

	const proxyUrl = new URL(rawProxyUrl);

	// TODO: Support ./../
	return (
		url
			// /
			.replace(/^(\/)/g, $aero.config.prefix + proxyUrl.origin + "/")
			// ./
			.replace(
				/^(\.\/)/g,
				$aero.config.prefix + levelsDown(proxyUrl.href, 1) + "/"
			)
			// ../
			.replace(
				/^(\.\.\/)+/g,
				match =>
					levelsDown(
						proxyUrl.href,
						// Get the # of groups
						match.split("../").slice(0, -3).length
					) + "/"
			)
	);
};

/**
 * This should not be used for processed html attributes, rather rewriteSrcHtml
 * @param {string} - The url to rewrite
 */
$aero.rewriteSrc = url => {
	// Prepare first part
	let rewrittenUrl = $aero.rewriteRelativeUrl(url, $aero.config.prefix);

	// Protocol
	if (/^(https?:\/\/)/g.test(rewrittenUrl))
		rewrittenUrl = $aero.config.prefix + rewrittenUrl;

	if ($aero.config.debug.src) console.info(`${url} ➜ ${rewrittenUrl}`);

	return rewrittenUrl;
};

export default $aero;
