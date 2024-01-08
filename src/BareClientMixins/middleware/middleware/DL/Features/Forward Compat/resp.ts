import { ResponseMiddleware, ResponseContext } from "mw";

import getBrowserInfoResp from "./lib/getBrowserInfoResp";
import IsNotSupported from "./lib/IsNotSupported";

import {
	convertAPNGtoGIF,
	// TODO: Use these
	convertSVGToICO,
	convertPNGToICO,
} from "./lib/converters";

const lib: ResponseMiddleware = {
	handle: async (ctx: ResponseContext): Promise<Response> => {
		// @ts-ignore
		const matchedResp = Cache.match(ctx.resp.url);
		if (matchedResp) return matchedResp;

		const mime = ctx.resp.headers.get("content-type");
		const browserInfo = getBrowserInfoResp(ctx.resp);
		const isNotSupported = new IsNotSupported(browserInfo);

		const newResp = (async (): Promise<Response | false> => {
			switch (ctx.req.destination) {
				// Ordered based on difficulty to implement (higher to lower)
				case "image":
					if (mime === "image/svg+xml") {
						// TODO: Determine
						const isFaviconReq = false;
						if (
							isNotSupported.check("link-icon-svg") &&
							isFaviconReq
						)
							return await convertSVGToICO(ctx.resp);
						// TODO: If IE9-IE11, Edge12, Safari 5.1-6, or UCWeb11 inject https://github.com/thasmo/external-svg-polyfill into the html
					} else if (
						isNotSupported.check("link-icon-png") &&
						mime === "image/png"
					)
						return await convertPNGToICO(ctx.resp);
					else if (
						isNotSupported.check("apng") &&
						mime === "image/apng"
					)
						// Convert APNG to a GIF
						return await convertAPNGtoGIF(ctx.resp);
					break;
				case "video":
					break;
				case "font":
					if (isNotSupported.check("fontface"))
						// TODO: Convert
						null; // STUB
			}
			return false;
		})();

		if (newResp)
			// @ts-ignore
			Cache.put(ctx.req, ctx.resp);

		return ctx.resp;
	},
};

export default lib;
