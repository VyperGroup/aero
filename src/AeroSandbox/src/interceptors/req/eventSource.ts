import { APIInterceptor, SpecialInterceptionFeaturesEnum } from "$aero/types";

import { proxyConstructString } from "$src/shared/stringProxy";

export default {
	proxifiedObj: ctx => {
		if (
			"requestUrlProxifier" in ctx.specialInterceptionFeatures &&
			ctx.specialInterceptionFeatures.requestUrlProxifier === true
		)
			return proxyConstructString("EventSource", [1]);
		return;
	},
	globalProp: "EventSource",
	specialInterceptionFeatures:
		SpecialInterceptionFeaturesEnum.requestUrlProxifier,
} as APIInterceptor;
