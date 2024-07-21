import { APIInterceptor, SupportEnum } from "$aero/types";

import afterPrefix from "$src/shared/afterPrefix";

export default {
	proxifiedObj: new Proxy(launchQueue.setConsumer, {
		apply(_target, _that, args) {
			const [callback] = args;

			// Intercept the manifest
			return (params: any) => {
				params.targetUrl = afterPrefix(params.targetUrl);

				callback(params);
			};
		},
	}),
	globalProp: "launchQueue.setConsumer",
	supports: SupportEnum.draft | SupportEnum.shippingChromium,
} as APIInterceptor;
