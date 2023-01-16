WebSocket = new Proxy(WebSocket, {
	construct(target, args) {
		console.log("Intercepting Websocket connection");

		[url] = args;

		const rewrittenUrl = `${
			location.protocol === "https:" ? "wss" : "ws"
		}://${location.host}/${$aero.config.proxyApiWs}?url=${url}`;

		args[0] = rewrittenUrl;

		return Reflect.construct(...arguments);
	},
});
