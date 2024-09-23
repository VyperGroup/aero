import {
	type APIInterceptor,
	ExposedContextsEnum
} from "$types/apiInterceptors";

import { proxyLocation } from "$shared/proxyLocation";

export default {
	modifyObjectProperty() {
		Object.defineProperty(window, "isSecureContext", {
			get: () =>
				//flags.emulateSecureContext ||
				proxyLocation().protocol === "https:"
		});
	},
	globalProp: "isSecureContext",
	exposedContexts: ExposedContextsEnum.window
} as APIInterceptor;
