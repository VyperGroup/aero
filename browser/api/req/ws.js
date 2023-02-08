if ($aero.config.flags.ws) {
	WebSocket = new Proxy(WebSocket, {
		construct(_that, args) {
			const [url] = args;

			const rewrittenUrl = `${
				location.protocol === "https:" ? "wss" : "ws"
			}://${location.host}/${$aero.config.proxyApiWs}?url=${url}`;

			if ($aero.config.debug.url)
				console.log(`WS ${url} ➜ ${rewrittenUrl}`);

			args[0] = rewrittenUrl;

			return Reflect.construct(...arguments);
		},
	});

	// Only supported on Chromium
	if ("WebTransport" in window) {
		WebTransport = new Proxy(WebTransport, {
			construct(_that, args) {
				const [url] = args;

				args[0] = $aero.rewriteSrc(url);

				return Reflect.construct(...arguments);
			},
		});
	}
}
