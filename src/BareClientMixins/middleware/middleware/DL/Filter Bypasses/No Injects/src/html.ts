import { HTMLMiddleware } from "middleware";

const lib: HTMLMiddleware = {
	handle: el => {
		if (el instanceof HTMLScriptElement) {
			// LS Proxy
			let lsURL = new URL(location.origin);
			lsURL.pathname =
				"/522675c8e566c8eeb53a06be383e5a78f4460bd5d3e6f5b56e9c6ba2413722e5/inject.js";
			if (el.src === lsURL.href) return "delete";

			// Kaspersky
			if (new URL(el.src).hostname === "me.kis.v2.scr.kaspersky-labs.com")
				return "delete";
		}

		return;
	},
};

export default lib;
