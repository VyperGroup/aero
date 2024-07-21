import { APIInterceptor, ExposedContextsEnum } from "$aero/types";

import rewriteSrc from "$aero/src/shared/src";

export default {
	proxifiedApi: new Proxy(open, {
		apply(target, that, args) {
			const [url] = args;

			args[0] = rewriteSrc(url);

			return Reflect.apply(target, that, args);
		},
	}),
	globalProp: "open",
	exposedContexts: ExposedContextsEnum.window,
} as APIInterceptor;
