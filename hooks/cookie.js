if ("cookieStore" in window) {
	cookieStore.set = new Proxy(cookieStore.set, {
		apply(target, that, args) {
			[cookie] = args;

			cookie.domain = location.domain;
			cookie.path = locationUpToProxyOrigin + cookie.path;

			args[0] = cookie;

			return Reflect.apply(...arguments);
		},
	});

	function getOriginalCookie(cookie) {
		// Not done
		return cookie;
	}

	cookieStore.get = new Proxy(cookieStore.set, {
		apply(target, that, args) {
			[, url] = args;

			url = locationUpToProxyOrigin + cookie.path;

			args[1] = url;

			return getOriginalCookie(Reflect.apply(...arguments));
		},
	});
	cookieStore.get = new Proxy(cookieStore.set, {
		apply(target, that, args) {
			[, url] = args;

			url = locationUpToProxyOrigin + cookie.path;

			args[1] = url;

			return Reflect.apply(...arguments).map(cookie =>
				getOriginalCookie(cookie)
			);
		},
	});
}

$aero.cookie = document.cookie;
Object.defineProperty(document, "cookie", {
	get: () => $aero.rewriteGetCookie($aero.cookie),
	set: value => ($aero.cookie = $aero.rewriteSetCookie(value)),
});
