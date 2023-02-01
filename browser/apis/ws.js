WebSocket = new Proxy(WebSocket, {
	construct(target, args) {
		[url] = args;

		const rewrittenUrl = `${
			location.protocol === "https:" ? "wss" : "ws"
		}://${location.host}/${$aero.config.proxyApiWs}?url=${url}`;

		console.log(`WS ${url} -> ${rewrittenUrl}`);

		args[0] = rewrittenUrl;

		return Reflect.construct(...arguments);
	},
});

// Only supported on Chromium
if ("WebTransport" in window) {
	// https://developer.mozilla.org/en-US/docs/Web/API/WebTransport
	WebTransport = new Proxy(WebTransport, {
		construct(target, args) {
			[url] = args;

			args[0] = $aero.rewriteSrc($aero.config.prefix, url);

			return Reflect.construct(...arguments);
		},
	});
}
