import type { APIInterceptor } from "$types/apiInterceptors";

// Only supported on Chromium
export default {
	proxifiedObj: Proxy.revocable(WebTransport, {
		construct(target, args) {
			// I'm waiting for the bare/wisp spec to support WebTransport before implementing this
			return Reflect.construct(target, args);
		}
	}),
	globalProp: "WebTransport"
} as APIInterceptor;
