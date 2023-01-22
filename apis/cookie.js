if ("cookieStore" in window) {
	function getOriginalCookie(cookie) {
		// Not done
		return cookie;
	}
	
	cookieStore.set = new Proxy(cookieStore.set, {
		apply(target, that, args) {
			[cookie] = args;

			cookie.domain = location.domain;
			cookie.path = locationUpToProxyOrigin + cookie.path;

			args[0] = cookie;

			return Reflect.apply(...arguments);
		},
	});
	cookieStore.get = new Proxy(cookieStore.set, {
		apply(target, that, args) {
			return getOriginalCookie(Reflect.apply(...arguments));
		},
	});
}

$aero.cookie = document.cookie;
Object.defineProperty(document, "cookie", {
	get: () => $aero.rewriteGetCookie($aero.cookie),
	set: value => ($aero.cookie = $aero.rewriteSetCookie(value)),
});
