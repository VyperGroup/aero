window.fetch = new Proxy(fetch, {
	apply(target, that, args) {
		let [opts, headers] = args;

		if (
			opts.cache &&
			// only-if-cached requires the mode to be same origin
			!(opts.mode !== "same-origin" && opts.cache === "only-if-cached")
		) {
			if (!headers) headers = [];
			// Emulate cache mode
			else if (headers instanceof Headers)
				headers.append("x-aero-cache", opts.cache);
			else headers["x-aero-cache"] = opts.cache;
		}

		return Reflect.apply(target, that, args).then(resp => {
			const pass = resp.headers.get("x-headers");

			if (pass !== null) resp.headers = new Headers(JSON.parse(pass));

			return resp;
		});
	},
});

{
	const err1 = new Error("Unable to find bare passthrough headers");
	const err2 = new Error("Unable to parse bare passthrough headers");

	XMLHttpRequest.prototype.getResponseHeader = new Proxy(
		XMLHttpRequest.prototype.getResponseHeader,
		{
			apply(target, that, args) {
				if (args.length > 0) {
					let [name] = args;

					const pass = target.bind(that)("x-headers");

					if (pass !== null) {
						const passHeaders = JSON.parse(pass);

						if (typeof passHeaders === "object")
							return passHeaders[name];
						else throw err2;
					}
					throw err1;
				} else return Reflect.apply(target, that, args);
			},
		}
	);
	XMLHttpRequest.prototype.getAllResponseHeaders = new Proxy(
		XMLHttpRequest.prototype.getAllResponseHeaders,
		{
			apply(target, that) {
				let ret = "";

				const pass = target.bind(that)["x-headers"];
				if (pass !== null) {
					const passHeaders = JSON.parse(pass);
					if (typeof passHeaders === "object") {
						// CRLF
						for (const [key, val] of Object.entries(passHeaders))
							ret += `${key}: ${val}\r\n`;

						return ret;
					}
					throw err1;
				}
				throw err2;
			},
		}
	);

	XMLHttpRequest.prototype.getResponseHeader = new Proxy(
		XMLHttpRequest.prototype.getResponseHeader,
		{
			apply(target, that, args) {
				const [name] = args;

				const pass = target.bind(that)("x-headers");

				if (pass !== null) {
					const passHeaders = JSON.parse(pass);
					if (typeof passHeaders === "object")
						return passHeaders[name];
					else throw err2;
				} else throw err1;
			},
		}
	);
}
