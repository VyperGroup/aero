import matchWildcard from "this/misc/match";

import { getTabId } from "./util/getId";

// @ts-ignore
const lib: RequestHandler = {
	handle: async ctx => {
		// Activate webRequest api listeners
		if (
			((): boolean => {
				if (opt.filter.urls) {
					for (const match of opt.filter.urls)
						if (matchWildcard(match)) return true;
					return false;
				}
				return true;
			})() &&
			((): boolean => {
				if (opt.filter.types)
					return opt.filter.types === ctx.req.destination;
				return true;
			})() &&
			((): boolean => {
				if (opt.filter.tabId)
					return opt.filter.tabId === (await getTabId(ctx.req));
				return true;
			})() &&
			((): boolean => {
				if (opt.filter.tabId)
					return opt.filter.tabId === (await getWindowId(ctx.req));
				return true;
			})()
			// TODO: Emulate incognito state
		) {
			const resp = opt.listener();
			// TODO: Respect extraInfoSpec
			if (resp instanceof browser.webRequest.RequestFilter) return resp;
		}

		return ctx.req;
	},
};

export default lib;
