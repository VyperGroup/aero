import { RequestMiddleware } from "middleware";

import handleChromeUrl from "./Proxy/urlHandlers/chromeUrl";
import handleAbout from "./Proxy/urlHandlers/chromeUrl";
import handleIcon from "./Proxy/urlHandlers/icon";

const lib: RequestMiddleware = {
	handle: async ctx => {
		let resp: Response;
		const url = ctx.url;
		if (url.protocol === "chrome:") {
			const ret = await handleChromeUrl(url);
			if (ret) resp = ret;
		} else if (url.protocol === "moz-icon:") {
			const ret = await handleIcon(url);
			if (ret) resp = ret;
		} else if (url.protocol === "about:") {
			const ret = await handleAbout(url);
			if (ret) resp = ret;
		}
		if (resp)
			return {
				rewriteUrls: [
					path => path.replace(/^([a-z-]+:\/\/).*/m, "/$&"),
				],
				resp,
			};

		return ctx.req;
	},
};

export default lib;
