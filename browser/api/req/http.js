fetch = new Proxy(fetch, {
	apply(_target, _that, args) {
		[opts, headers] = args;

		if (
			opts.cache &&
			// only-if-cached requires the mode to be same origin
			!(opts.mode !== "same-origin" && opts.cache === "only-if-cached")
		) {
			if (!headers) headers = [];
			else if (headers instanceof Headers)
				// Emulate cache mode
				headers.add("x-aero-cache", opts.cache);
			else headers["x-aero-cache"] = opts.cache;
		}

		return Reflect.apply(...arguments).then(resp => {
			const rawHeaders = resp.headers.get("x-headers");

			if (rawHeaders)
				resp.headers = new Headers(
					JSON.parse(resp.headers.get("x-headers"))
				);

			return resp;
		});
	},
});

XMLHttpRequest.prototype.getResponseHeader = new Proxy(
	XMLHttpRequest.prototype.getResponseHeader,
	{
		apply(target, that, args) {
			if (args.length > 0) {
				let [name] = args;

				return JSON.parse(target.bind(that)("x-headers"))[name];
			} else return Reflect.target(...arguments);
		},
	}
);
XMLHttpRequest.prototype.getAllResponseHeaders = new Proxy(
	XMLHttpRequest.prototype.getAllResponseHeaders,
	{
		apply(target, that, args) {
			let ret = "";

			// CRLF
			for (const [key, val] of Object.entries(
				JSON.parse(target.bind(that)("x-headers"))
			))
				ret += `${key}: ${val}\r\n`;

			return ret;
		},
	}
);

XMLHttpRequest.prototype.setResp = new Proxy(
	XMLHttpRequest.prototype.getResponseHeader,
	{
		apply(target, that, args) {
			[name] = args;

			return JSON.parse(target.bind(that)("x-headers"))[name];
		},
	}
);
