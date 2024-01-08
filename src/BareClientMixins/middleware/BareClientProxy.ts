import { BareClient } from "@tomphttp/bare-client";

function sandboxFunc(func: Function) {
	return func.bind({
		// Proxy fetch requests by overwriting fetch in the scope of the handler
		fetch: super.fetch,
	});
}

let firstReq = true;

export default class extends BareClient {
	constructor(target, args) {
		if (firstReq) {
			// Init middleware
			const ctx = require.context(
				"../middleware/",
				true,
				/init.(\.js|\.ts)$/,
			);
			ctx.keys().forEach(path =>
				ctx(path).then(mod => sandboxFunc(mod.handle())),
			);
			firstReq = false;
		}
		return Reflect.construct(target, args);
	}
	async fetch(url, init) {
		// Request middleware
		const ctx = require.context(
			"../middleware/",
			true,
			/html.(\.js|\.ts)$/,
		);
		for (const path of ctx.keys()) {
			const mod = await ctx(path);

			if (
				!mod.match ||
				(Array.isArray(mod.match)
					? (): boolean => {
							for (const match of mod.match)
								if (matchWildcard(match, proxyUrl.href))
									return true;
							return false;
						}
					: matchWildcard(mod.match, proxyUrl.href))
			) {
				let ret = await sandboxFunc(mod.handle)({
					req: new Request(proxyUrl.href, {
						...opts,
					}),
					isHTML,
					isiFrame,
					isNavigate,
				});

				if (ret instanceof Request) mockReq = ret;
				else if (ret instanceof Response) return ret;
			}
		}

		let resp = super.fetch(url, init);

		// Response middleware
		const ctxResp = require.context(
			"../../middleware/",
			true,
			/resp.(\.js|\.ts)$/,
		);
		ctxResp.keys().forEach(path => {
			ctxResp(path).then(async mod => {
				if (
					!mod.match ||
					(Array.isArray(mod.match)
						? (): boolean => {
								for (const match of mod.match)
									if (matchWildcard(match, proxyUrl.href))
										return true;
								return false;
							}
						: matchWildcard(mod.match, proxyUrl.href))
				) {
					resp = await sandboxFunc(mod.handle)({
						req: new Request(proxyUrl.href, {
							...opts,
						}),
						isHTML,
						isiFrame,
						isNavigate,
					});
				}
			});
		});

		return resp;
	}
}
