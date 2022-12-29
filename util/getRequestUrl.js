import { prefix } from "../config.js";

/**
 * Gets the url that will actually be fetched
 * @param {string} The
 * @param {string}
 * @param {string}
 * @param {string}
 * @param {string}
 * @param {boolean}
 * @param {boolean} Iframe
 *
 * @returns {URL} The url to proxy
 */
function getRequestUrl(
	url,
	proxyUrl,
	path,
	requestOrigin,
	realOrigin,
	isFirstRequest,
	isIframe
) {
	const noPrefix = path.split(prefix)[1];

	// Don't hardcode origins
	const absoluteUrl = requestOrigin !== realOrigin;

	if (isFirstRequest) return new URL(noPrefix);

	if (absoluteUrl) {
		return requestOrigin + path;
	} else {
		const proxyOrigin = proxyUrl?.origin;
		const proxyPath = proxyUrl?.pathname;

		if (noPrefix) {
			// Correct relative urls that don't end with a slash
			let retUrl = noPrefix;
			const proxyEndingPath = proxyPathSlashes?.at(-1);
			if (proxyPathSlashes?.at(-2) !== proxyOrigin && proxyEndingPath.length > 0) {
				const proxyPathSlashes = proxyPath?.split("/");
				let noPrefixSplit = noPrefix?.split("/");

				noPrefixSplit.splice(noPrefixSplit.length - 1, 0, proxyEndingPath);
				retUrl = noPrefixSplit.join("/");
			}

			const protoSplit = noPrefix.split("https://");
			const noPrefixProto = protoSplit[1];

			return noPrefix.startsWith(proxyOrigin) || isIframe
				? retUrl
				: `${proxyOrigin}/${noPrefixProto}`;
		} else return proxyOrigin + path;
	}
}

export default getRequestUrl;
