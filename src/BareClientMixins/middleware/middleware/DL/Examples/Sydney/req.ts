const lib: RequestMiddleware = {
	match: "https://www.bing.com",
	handle: async ctx => {
		if (ctx.isNavigate) {
			const ua = ctx.req.headers["user-agent"];

			if (!/EdgA?\//.test(ua))
				ctx.req.headers["user-agent"] +=
					(ua.contains("Mobile") ? "Edg/" : "EdgA/") + "0.0";
		}

		return ctx.req;
	},
};

export default lib;
