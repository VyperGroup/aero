import config from "$aero_config";
const { prefix, flags } = config;

import {
	proxyLocation,
	upToProxyOrigin,
} from "$aero_browser/misc/proxyLocation";

import { rewriteGetCookie, rewriteSetCookie } from "$aero/shared/hared/cookie";

declare var cookieStore, CookieChangeEvent;

function getOriginalCookie(cookie) {
	// Not done
	return cookie;
}

if (flags.misc && "cookieStore" in window) {
	cookieStore.set = new Proxy(cookieStore.set, {
		apply(target, that, args) {
			const [cookie] = args;

			cookie.domain = $location.domain;
			cookie.path = upToProxyOrigin() + cookie.path;

			args[0] = cookie;

			return Reflect.apply(target, that, args);
		},
	});
	/*
	cookieStore.get = new Proxy(cookieStore.set, {
		apply(target, that, args) {
			return getOriginalCookie(
				prefix,
				Reflect.apply(target, that, args)
			);
		},
	});
	*/

	cookieStore.addEventListener = new Proxy(cookieStore.addEventListener, {
		apply(target, that, args) {
			const [type, listener] = args;

			if (type === "change")
				args[1] = event => {
					if (event instanceof CookieChangeEvent) {
						/*
						TODO: Rewrite
						event.changed
						event.deleted
						*/
					}

					event.listener(event);
				};

			return Reflect.apply(target, that, args);
		},
	});
}

{
	let cookieBak = document.cookie;
	Object.defineProperty(document, "cookie", {
		get: () => rewriteGetCookie(cookieBak, proxyLocation()),
		set: value => (cookieBak = rewriteSetCookie(value, proxyLocation())),
	});
}
