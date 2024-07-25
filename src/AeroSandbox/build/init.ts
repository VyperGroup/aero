import {
  APIInterceptor,
  proxifiedObjType,
  proxifiedObjGeneratorContext,
} from "../types";

import { buildConfig } from "./customBuilds/aero";
import { buildConfig as buildConfigFrakenUV } from "./customBuilds/frankenUV.inject.ts";

let proxifiedObjGenCtx: proxifiedObjGeneratorContext = {
  ...buildConfig.specialInterceptionFeatures,
};

if (process.env.BUILD_UV_FRAKEN)
  proxifiedObjGenCtx = {
    ...buildConfigFrakenUV.specialInterceptionFeatures,
  };

if (process.env.BUILD_WOMBAT_SHIM) {
  // TODO: Build
}

type level = number;
const insertLater = new Map<level, proxifiedObjType>();

// @ts-ignore TODO: Move this code to AeroSandbox
const ctx = import.meta.webpackContext("../src/interceptors", {
  include: /\.ts$/,
});
for (const fileName of ctx.keys()) {
  console.log(fileName);
  const aI: APIInterceptor = ctx(fileName);
  if (aI.insertLevel && aI.insertLevel !== 0)
    insertLater.set(aI.insertLevel, aI);
  else handleAI(aI);
}

// @ts-ignore
const sortedInsertObj = Object.entries(
  Array.from(insertLater.keys()).sort((a, b) => b[1] - a[1])
) as {
  [key: string]: APIInterceptor;
};

for (const aI of Object.values(sortedInsertObj)) {
  handleAI(aI);
}

function handleAI(aI: APIInterceptor): void {
  if (aI.exposedContexts) {
    if (Object.values(aI.exposedContexts).includes("window")) {
      // @ts-ignore
      if (aI.proxifiedObj) {
        let proxyObject = resolveProxifiedObj(
          // @ts-ignore
          aI.proxifiedObj,
          proxifiedObjGenCtx
        );

        window[aI.globalProp] = proxyObject;
      } // @ts-ignore
      else if (aI.proxifiedObjWorkerVersion) {
        Object.defineProperty(
          window,
          aI.globalProp,
          aI.proxifiedObjWorkerVersion
        );
      }
    }
  } else {
    // @ts-ignore
    if (aI.proxifiedObj) {
      let proxyObject = resolveProxifiedObj(
        // @ts-ignore
        aI.proxifiedObj,
        proxifiedObjGenCtx
      );

      self[aI.globalProp] = proxyObject;
    } // @ts-ignore
    else if (aI.proxifiedObjWorkerVersion) {
      Object.defineProperty(self, aI.globalProp, aI.proxifiedObjWorkerVersion);
    }
  }
}

function resolveProxifiedObj(
  proxifiedObj: proxifiedObjType,
  ctx: proxifiedObjGeneratorContext
): proxifiedObjType {
  let proxyObject = {};
  if (typeof proxifiedObj === "function") proxyObject = proxifiedObj(ctx);
  else if (typeof proxifiedObj === "object") proxyObject = proxifiedObj;
  return proxyObject;
}
