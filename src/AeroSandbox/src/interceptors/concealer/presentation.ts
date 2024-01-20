import { proxyGetString } from "$aero/shared/autoProxy/autoProxy";

import rewriteSrc from "$aero/shared/src";

import { proxyLocation } from "$aero_browser/misc/proxyLocation";

declare let PresentationRequest: any;

if ("Presentation" in window) {
	PresentationRequest = new Proxy(PresentationRequest, {
		construct(_that, args) {
			// Could either be a string or an array
			let [urls] = args;

			if (Array.isArray(urls))
				urls = urls.map(url => $aero.rewriteSrc(url));
			else urls = $aero.rewriteSrc(urls);

			args[0] = urls;

			return Reflect.construct(...arguments);
		},
	});
	proxyGetString("PresentationConnection", ["url"]);
}
