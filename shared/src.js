// For module scripts
if (typeof $aero === "undefined") var $aero = {};

/**
 * Go a few levels up of the current directory given by the url
 * @param {string} - A url
 * @param {number} - How far up
 */
function levelsDown(url, level) {
	// TODO: Make sure this doesn't go out of bounds (Behind the site domain)
	return url.split("/").slice(0, -level).join("/");
}

function rewriteFirstPart(prefix, url, proxyUrl) {
	return (
		url
			// /
			.replace(/^(\/)/g, prefix + proxyUrl.origin + "/")
			// ./
			.replace(/^(\.\/)/g, prefix + levelsDown(proxyUrl.href, 1) + "/")
			// (recursive)../
			.replace(/\.\.\/+/g, (_, ...rest) => {
				return (
					levelsDown(
						proxyUrl.href,
						// Get the # of groups
						[...rest].slice.slice(0, -3).length
					) + "/"
				);
			})
	);
}

/**
 * This should not be used for processed html attributes, rather rewriteSrcHtml
 * @param {string} - The url to rewrite
 */
$aero.rewriteSrc = (prefix, url) => {
	const rawProxyUrl =
		location.pathname.replace(new RegExp(`^(${prefix})`), "") +
		location.search;

	var proxyUrl = new URL(rawProxyUrl);

	// Prepare first part
	let rewrittenUrl = rewriteFirstPart(prefix, url, proxyUrl);

	// Protocol
	if (/^(https?:\/\/)/g.test(rewrittenUrl))
		rewrittenUrl = prefix + rewrittenUrl;

	// Change this to debug
	if (false) console.info(`${url} -> ${rewrittenUrl}`);

	return rewrittenUrl;
};

export default $aero.rewriteSrc;
