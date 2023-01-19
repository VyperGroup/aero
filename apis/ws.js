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
