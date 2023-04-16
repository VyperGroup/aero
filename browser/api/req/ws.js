if ($aero.config.flags.ws) {
	WebSocket = new Proxy(WebSocket, {
		construct(_that, args) {
			if ($aero.useBare)
				return new createBareClient(
					$aero.config.backends[0]
				).createWebsocket(...args);

			const [url] = args;

			let ret;

			for (const backend of $aero.config.wsBackends) {
				const rewrittenUrl = `${
					location.protocol === "https:" ? "wss" : "ws"
				}://${location.host}${$aero.rewriteSrc(backend)}?url=${url}`;

				if ($aero.config.debug.url)
					console.debug(`WS ${url} ➜ ${rewrittenUrl}`);

				args[0] = rewrittenUrl;

				try {
					new Promise((resolve, reject) => {
						const ws = Reflect.construct(...arguments);

						ws.addEventListener("open", () => {
							resolve(ws);
						});
						ws.addEventListener("error", () => {
							reject();
						});
					})
						.then(ws => (ret = ws))
						.catch(() =>
							console.warn(`WS Backend ${backend} is down`)
						);
				} catch (err) {
					if (err instanceof DOMException)
						console.warn(
							`Config issue: invalid backend url ${backend}`
						);
				}
			}

			return ret;
		},
	});

	// Only supported on Chromium
	if ("WebTransport" in window)
		WebTransport = new Proxy(WebTransport, {
			construct(_that, args) {
				const [url] = args;

				args[0] = $aero.rewriteSrc(url);

				return Reflect.construct(...arguments);
			},
		});
}
