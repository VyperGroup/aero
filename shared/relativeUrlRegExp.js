// Alternative module for if the location is unknown or you want to avoid using the URL api

// For the SW
import * as config from "../config.js";
if (typeof $aero === "undefined")
	var $aero = {
		config: config,
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

$aero.processRelativeUrlRegex = (url, loc = $aero.proxyLocation.href) => {
	const url = new URL(loc);

	return (
		url
			// /
			.replace(/^(\/)/g, $aero.config.prefix + url.origin + "/")
			// ./
			.replace(
				/^(\.\/)/g,
				$aero.config.prefix + levelsDown(url.href, 1) + "/"
			)
			// ../
			.replace(
				/^(\.\.\/)+/g,
				match =>
					levelsDown(
						url.href,
						// Get the # of groups
						match.split("../").slice(0, -3).length
					) + "/"
			)
	);
};
