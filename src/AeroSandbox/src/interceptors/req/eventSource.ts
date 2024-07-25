import {
  APIInterceptor,
  SpecialInterceptionFeaturesEnum,
} from "$types/index.d";

import { proxyConstructString } from "$shared/stringProxy";

export default {
  proxifiedObj: ctx => {
    if (
      "requestUrlProxifier" in ctx.specialInterceptionFeatures &&
      ctx.specialInterceptionFeatures.requestUrlProxifier === true
    )
      return proxyConstructString("EventSource", [1]);
    return;
  },
  globalProp: "EventSource",
  specialInterceptionFeatures:
    SpecialInterceptionFeaturesEnum.requestUrlProxifier,
} as APIInterceptor;
