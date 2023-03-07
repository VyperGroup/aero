// For the SW
import * as config from "../config.js";
import processRelativeUrl from "./relativeUrl.js";
if (typeof $aero === "undefined")
	var $aero = {
		config: config,
		processRelativeUrl,
	};

/**
 * This should not be used for processed html attributes, rather rewriteSrcHtml
 * @param {string} - The url to rewrite
 */
$aero.rewriteSrc = url => {
	// Prepare first part
	let rewrittenUrl = $aero.processRelativeUrl(url, $aero.config.prefix);

	// Protocol
	if (/^(https?:\/\/)/g.test(rewrittenUrl))
		rewrittenUrl = $aero.config.prefix + rewrittenUrl;

	if ($aero.config.debug.src) console.info(`${url} ➜ ${rewrittenUrl}`);

	return rewrittenUrl;
};

export default $aero;
