import {
	type APIInterceptor,
	ExposedContextsEnum
} from "$types/apiInterceptors";

import rewriteSrc from "$shared/src";

export default {
	proxifiedApi: new Proxy(open, {
		apply(target, that, args) {
			const [url] = args;

			args[0] = rewriteSrc(url);

			return Reflect.apply(target, that, args);
		}
	}),
	globalProp: "open",
	exposedContexts: ExposedContextsEnum.window
} as APIInterceptor;
