import { proxyConstruct, proxyGetString } from "shared/autoProxy/autoProxy";

import rewriteSrc from "shared/src";

import { proxyLocation } from "browser/misc/proxyLocation";

if ("Presentation" in window) {
	proxyConstruct(
		"PresentationRequest",
		new Map().set(0, urls => {
			// Could either be a string or an array
			if (Array.isArray(urls))
				urls = urls.map(url => rewriteSrc(url, proxyLocation().href));
			else urls = rewriteSrc(urls, proxyLocation().href);

			return urls;
		})
	);
	proxyGetString("PresentationConnection", ["url"]);
}
