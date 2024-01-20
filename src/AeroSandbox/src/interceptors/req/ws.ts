import { backends, flags } from "$aero_config";

import { BareClient } from "@tomphttp/bare-client";

import rewriteSrc from "$aero/shared/src";
import { proxyLocation } from "$aero_browser/misc/proxyLocation";

declare var WebTransport;

if (flags.ws) {
	const bare = new BareClient(backends[0]);

	WebSocket = bare.createWebsocket;
}
