import { APIInterceptor, ExposedContextsEnum } from "$aero/types";

import config from "config";
const { flags } = config;

import { proxyLocation } from "$src/shared/proxyLocation";

export default {
	modifyObjectProperty() {
		Object.defineProperty(window, "isSecureContext", {
			get: () =>
				flags.emulateSecureContext ||
				proxyLocation().protocol === "https:",
		});
	},
	globalProp: "isSecureContext",
	exposedContexts: ExposedContextsEnum.window,
} as APIInterceptor;
