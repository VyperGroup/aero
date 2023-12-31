//@ts-nocheck

// TODO: Intercept all downlaods for .user.ts to be installed
const bcInstall = new BroadcastChannel("USERSCRIPTS_INSTALL");

const lib: RequestHandler = {
	handle: async ctx => {
		if (
			ctx.req.url.endsWith(".user.js") &&
			ctx.req.destination === "script"
		)
			bcInstall.postMessage(await (await fetch(ctx.req.url)).text());
		return new Response("Installed!");
	},
};
