/**
 * Extends src rewriting for processed html urls
 * @param {string} - The url to rewrite
 * @param {string} - If its to rewrite an iFrame src
 */
$aero.rewriteHtmlSrc = (src, isIFrame) => {
	const url = $aero.proto.get(
		src.replace(new RegExp(`^(${location.origin})`, "g"), "")
	);

	if (/^javascript:/g.test(url)) return $aero.scope(url);
	if (/^data:/g.test(url)) {
		if (isIFrame) {
			const exp = /^data:text\/html(;base64)?,/g;

			const matches = [...url.matchAll(exp)];

			if (matches.length === 2)
				return matches[0].replace(
					exp,
					"$&" +
						encodeURIComponent($aero.init + decodeURIComponent(url))
				);
			if (matches.length === 1)
				return "$&" + btoa($aero.init + atob(url));
		}
		return url;
	}
	if (
		// Ignore about:blank
		/^about:/g.test(url) ||
		// Don't rewrite again
		new RegExp(`^(${$aero.config.prefix})`).test(url)
	)
		return url;

	return $aero.rewriteSrc(url);
};
