import { ResponseMiddleware, ResponseContext } from "mw";

const lib: ResponseMiddleware = {
	handle: async (ctx: ResponseContext): Promise<Response> => {
		const successfulResponse =
			ctx.resp.status >= 200 && ctx.resp.status <= 299;
		if (successfulResponse) {
			// TODO: Archive
		}
		return ctx.resp;
	},
};

export default lib;
