import redir from "this/misc/redir";

import { RedirectsService, NetworkRuleOption } from "@adguard/tsurlfilter";

import agE from "./agEngine";

import getAgReq from "./agReq";

const agRedir = new RedirectsService();

const lib: RequestHandler = {
	handle: async (ctx: CTXReq): Promise<Request | Response> => {
		const agReq = getAgReq(new URL(ctx.req.url), ctx.req.destination);

		if (agReq) {
			const res = agE.matchRequest(agReq);

			const blocked = res.basicRule && !res.basicRule.isAllowlist();
			if (blocked)
				return new Response("Blocked by AdGuard", {
					status: 500,
				});

			if (res.isOptionEnabled(NetworkRuleOption.Redirect)) {
				await agRedir.init();

				const redirRes = res.getBasicResult();

				if (redirRes)
					return redir(
						agRedir.createRedirectUrl(
							redirRes.getAdvancedModifierValue(),
						),
					);
			}
		}
		return ctx.req;
	},
};

export default lib;
