import rewriteSrc from "$aero/shared/src";

import { proxyLocation } from "$aero_browser/misc/proxyLocation";

const historyState = {
	apply(target: any, that: ProxyHandler<object>, args: any[]) {
		let url = "";
		if (args.length > 2 && typeof args[2] === "string") {
			url = args[2];
		}

		try {
			if (args.length > 2) {
				args[2] = rewriteSrc(url, proxyLocation().href);
			}
			if (args.length > 3) {
				args[3] = rewriteSrc(url, proxyLocation().href);
			}
		} catch (error) {
			console.error(
				"An error occurred while intercepting the source in the History API interceptor: ",
				error
			);
		}

		return Reflect.apply(target, that, args);
	},
};

history.pushState = new Proxy(history.pushState, historyState);
history.replaceState = new Proxy(history.replaceState, historyState);
