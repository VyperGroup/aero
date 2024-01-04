import config from "$aero_config";
const { flags } = config;

import { proxyLocation } from "$aero_browser/misc/proxyLocation";

if (flags.emulateSecureContext) {
	const bak = isSecureContext;

	Object.defineProperty(window, "isSecureContext", {
		get: () => proxyLocation().protocol === "https:" || bak,
	});
}
