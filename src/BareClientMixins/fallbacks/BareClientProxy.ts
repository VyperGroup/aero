// @ts-nocheck

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
		let resp = super.fetch(url, init);

		return resp;
	}
}
