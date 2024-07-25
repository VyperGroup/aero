import { APIInterceptor, ExposedContextsEnum } from "$types/index.d";
import { proxyGetString } from "$shared/stringProxy";

export default {
  proxifiedObj: proxyGetString("PushSubscription", ["endpoint"]),
  globalProp: "PushSubscription",
  exposedContexts: ExposedContextsEnum.window,
} as APIInterceptor;
