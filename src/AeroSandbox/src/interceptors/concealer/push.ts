import { APIInterceptor, ExposedContextsEnum } from "$aero/types";
import { proxyGetString } from "$src/shared/stringProxy";

export default {
	proxifiedObj: proxyGetString("PushSubscription", ["endpoint"]),
	globalProp: "PushSubscription",
	exposedContexts: ExposedContextsEnum.window,
} as APIInterceptor;
