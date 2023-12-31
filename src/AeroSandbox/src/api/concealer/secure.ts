import { flags } from "$aero_config";

import { proxyLocation } from "browser/misc/proxyLocation";

if (flags.emulateSecureContext) {
	const bak = isSecureContext;

	Object.defineProperty(window, "isSecureContext", {
		get: () => proxyLocation().protocol === "https:" || bak,
	});
}
