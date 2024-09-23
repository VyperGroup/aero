/**
 * Gets the url that will actually be fetched
 * @param - The origin of the site
 * @param - The origin of the service worker
 * @param - raw url after the proxy prefix
 * @param - path of the site
 * @param - the request is for the homepage
 * @param - the site is inside of an iFrame
 * @returns The url to proxy
 */
function getRequestUrl(
	origin: string,
	workerOrigin: string,
	proxyUrl: URL,
	path: string,
	isHomepage: boolean,
	isiFrame: boolean
): string {
	const noPrefix = path.split(self.config.prefix)[1];

	// If it is the first request, there is no must do any relative url checking
	if (typeof noPrefix === "string" && isHomepage)
		return new URL(noPrefix).href;

	// Don't hardcode origins
	const absoluteUrl = origin !== workerOrigin;

	if (absoluteUrl) return origin + path;
	else {
		const proxyOrigin = proxyUrl?.origin;
		//const proxyPath = proxyUrl?.pathname;

		if (noPrefix) {
			const retUrl = noPrefix;

			// FIXME: Correct relative urls that don't end with a slash; this is an edge case
			/*
			const proxyEndingPath = proxyPathSlashes?.at(-1);
			const proxyPathSlashes = proxyPath?.split("/");
			if (
				proxyPathSlashes?.at(-2) !== proxyOrigin &&
				proxyEndingPath.length > 0
			) {
				let noPrefixSplit = noPrefix?.split("/");

				$aero.log(proxyEndingPath);
				$aero.log(noPrefixSplit);

				noPrefixSplit.splice(
					noPrefixSplit.length - 1,
					0,
					proxyEndingPath
				);
				retUrl = noPrefixSplit.join("/");

				$aero.log(noPrefixSplit);
			}
			*/

			const protoSplit = noPrefix.split(/^(https?:\/\/)/g);
			const noPrefixProto = protoSplit.slice(2).join();

			// TODO: Do this without searching for labels (There could be a directory with them or it could be an unqualified domain)
			// Determine if it is a path or a domain
			return noPrefixProto.split("/")[0].includes(".") || isiFrame
				? retUrl
				: `${proxyOrigin}/${noPrefixProto}`;
		} else return proxyOrigin + path;
	}
}

export default getRequestUrl;
