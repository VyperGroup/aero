// Only supported on Chromium
if ("WebTransport" in window)
	WebTransport = new Proxy(WebTransport, {
		construct(target, args) {
			const [url] = args;

			args[0] = rewriteSrc(url, proxyLocation().href);

			return Reflect.construct(target, args);
		},
	});
