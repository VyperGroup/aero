import { CosmeticOption, Engine } from "@adguard/tsurlfilter";

import getAgReq from "./agReq";

import agE from "./agEngine";

const lib: ResponseHandler = {
	handle: async ctx => {
		const agReq = getAgReq(ctx.proxyUrl, ctx.req.destination);
		if (agReq && ctx.isHTML) {
			// HTML injection
			let agHide = "";
			let agHideScript = "";
			if (agReq) {
				const cosRes = agE.getCosmeticResult(
					agReq,
					CosmeticOption.CosmeticOptionAll,
				);
				agHide +=
					[
						...cosRes.elementHiding.generic,
						...cosRes.elementHiding.specific,
					].join(", ") + "{ display: none!important; }";

				agHideScript = cosRes
					.getScriptRules()
					.map(rule => rule.getScript())
					.join("\r\n");
			}

			return (
				(await ctx.resp.text()) +
				`
<!-- AdGuard cosmetic filters -->
<style>${agHide}</style>
<script>${agHideScript}</script>
`
			);
		}
		return ctx.resp;
	},
};

export default lib;
