declare var $aero: AeroTypes.GlobalAeroCTX;

import { handleFetchEvent } from "$aero_browser/util/swlessUtils";

window.fetch = new Proxy(fetch, {
	apply(target, that, args) {
		let [, opts] = args;
		opts ??= {};

		if ($aero.sandbox.swlessEnabled) {
			const nonDefaultResp = handleFetchEvent({
				request:
					args[0] instanceof Request
						? args[0]
						: new Request({
								...opts,
							}),
			});
			if (nonDefaultResp) return nonDefaultResp;
		}

		let reqOpts: object =
			args[0] instanceof Request
				? {
						...args[0],
						...opts,
					}
				: opts;

		let headers: Record<string, string> | never[] = [];

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

		if ($aero.sandbox.swlessEnabled) {
			const nonDefaultResp = handleFetchEvent({
				request: new Request(opts, {
					headers,
				}),
			});
			if (nonDefaultResp) return nonDefaultResp;
		}

		return Reflect.apply(target, that, args).then((resp: Response) => {
			const pass = resp.headers.get("x-headers");

			if (pass !== null) resp.headers = new Headers(JSON.parse(pass));

			// Conceal the site's origin if it is revealed
			const respUrl = new URL(resp.url);
			if (respUrl.origin === location.origin) return new Response();

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
		},
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
		},
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
		},
	);
}
