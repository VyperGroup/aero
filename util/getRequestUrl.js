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
	path,
	proxyOrigin,
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
		if (noPrefix) {
			const protoSplit = noPrefix.split("https://");
			const noPrefixProto = protoSplit[1];

			return noPrefix.startsWith(proxyOrigin) || isIframe
				? noPrefix
				: `${proxyOrigin}/${noPrefixProto}`;
		} else return proxyOrigin + path;
	}
}

export default getRequestUrl;
