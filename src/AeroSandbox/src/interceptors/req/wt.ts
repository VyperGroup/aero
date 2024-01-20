// Only supported on Chromium
if ("WebTransport" in window)
	WebTransport = new Proxy(WebTransport, {
		construct(target, args) {
			// TODO: Extend the bare spec to support WebTransportx
		},
	});
