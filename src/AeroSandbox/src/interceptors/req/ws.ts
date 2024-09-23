import { AltProtocolEnum, type APIInterceptor } from "$types/apiInterceptors";

import { BareClient } from "@mercuryworkshop/bare-mux";

import rewriteSrc from "$shared/src";

// TODO: (Percs) This file is incomplete
const client = new BareClient();

export default [
	{
		proxifiedObj: Proxy.revocable(WebSocket, {
			construct(target, args) {
				return client.createWebSocket(
					args[0],
					args[1],
					target,
					{
						"User-Agent": navigator.userAgent
					},
					ArrayBuffer.prototype
				);
			}
		}),
		forAltProtocol: AltProtocolEnum.webSockets,
		globalProp: "Websocket"
	}
] as APIInterceptor[];
