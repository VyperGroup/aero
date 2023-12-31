import rewriteSrc from "$aero/shared/src";

import { proxyLocation } from "$aero_browser/misc/proxyLocation";

const historyState = {
	apply(target, that, args) {
		const [, , url = ""] = args;

		// FIXME: Breaks on https://search.brave.com
		// FIXME: Reaches maximum call stack size on https://beinternetawesome.withgoogle.com/en_us/interland/
		console.log(url);
		console.log(args);

		args[2] = rewriteSrc(url, proxyLocation().href);
		args[3] = rewriteSrc(url, proxyLocation().href);

		return Reflect.apply(target, that, args);
	},
};

history.pushState = new Proxy(history.pushState, historyState);
history.replaceState = new Proxy(history.replaceState, historyState);
