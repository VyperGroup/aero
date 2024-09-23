import { type APIInterceptor, SupportEnum } from "$types/apiInterceptors";

import { afterPrefix } from "$shared/getProxyUrl";

export default {
	proxifiedObj: Proxy.revocable(launchQueue.setConsumer, {
		apply(_target, _that, args) {
			const [callback] = args;

			// Intercept the manifest
			return (params: any) => {
				params.targetUrl = afterPrefix(params.targetUrl);

				callback(params);
			};
		}
	}),
	globalProp: "launchQueue.setConsumer",
	supports: SupportEnum.draft | SupportEnum.shippingChromium
} as APIInterceptor;
