import rewriteSrc from "shared/src";

import afterPrefix from "shared/afterPrefix";

import { proxyLocation } from "browser/misc/proxyLocation";

/*
if ("serviceWorker" in navigator && "index" in ServiceWorkerRegistration) {
	ServiceWorkerRegistration.index.add = new Proxy(ServiceWorkerRegistration.index.add, {
		apply(target, that, args) {
			const [url] = args;

			args[0] = rewriteSrc(url, proxyLocation().href);

			return Reflect.apply(...argument);
		},
	});

	ServiceWorkerRegistration.index.getAll = new Proxy(ServiceWorkerRegistration.index.getAll, {
		apply() {
			const ret = Reflect.target(...arguments);

			for (const desc of ret) desc.url = afterPrefix(desc.url);

			return ret;
		},
	});
}
*/
