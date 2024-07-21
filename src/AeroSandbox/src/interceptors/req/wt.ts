import { APIInterceptor } from "$aero/types";

// Only supported on Chromium
export default {
	proxifiedObj: new Proxy(WebTransport, {
		construct(target, args) {
			// I'm waiting for the bare/wisp spec to support WebTransport
			return Reflect.construct(target, args);
		},
	}),
	globalProp: "WebTransport",
} as APIInterceptor;
