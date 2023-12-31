import parse from "userscript-parser";
import matchWildcard from "this/misc/match";

import getScripts from "./getScripts";

import config from "./config";
const { allowDetection } = config;

// https://www.tampermonkey.net/documentation.php
const lib: ResponseHandler = {
	handle: async ctx => {
		if (ctx.isHTML && ctx.isNavigate) {
			// TODO: Respect @run-at
			const injects: string[] = [];

			for (const rawScript of await getScripts()) {
				const script = parse(rawScript);

				if (!(script.meta.noframe && ctx.req.destination === "frame"))
					if (
						matchWildcard(script.meta.match, ctx.req.url) &&
						matchWildcard(
							script.meta.include,
							ctx.req.url,
							false,
						) &&
						!matchWildcard(script.meta.exclude, ctx.req.url)
					) {
						for (const dep of script.meta.require)
							injects.push(await (await fetch(dep)).text());
						injects.push(`
<script>
	import apis from "./api";

	const meta = ${JSON.stringify(script.meta)};

	${
		script.meta.grant === "none"
			? `
		((window, unsafeWindow) => {
			${script.content}
		}).call(apis, undefined, window)`
			: script.content
	}

	${script.content}
</script>`);
					}
			}

			return (
				(allowDetection
					? `
<script>
	// Allow detection for script managers
	var external = {
		Tampermonkey: true,
		Violentmonkey: true
	}
</script>
				`
					: "") +
				(await ctx.resp.text()) +
				injects.join("")
			);
		}
		return ctx.resp;
	},
};

export default lib;
