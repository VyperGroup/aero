/**
 * Rewrite the src url for processed html urls
 * @param {string} - The url to rewrite
 */
$aero.rewriteHtmlSrc = src => {
	const url = src.replace(new RegExp(`^(${location.origin})`, "g"), "");

	if (/^(about:|data:|javascript:)/g.test(url)) return url;

	return $aero.rewriteSrc($aero.config.prefix, url);
};
