type overwriteRecordsType = { [key: string]; Object };

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type revokableProxyRet = { proxy: any; revoke: () => void };
interface proxifiedObjGeneratorContext {
  specialInterceptionFeatures?: InterceptionFeaturesEnum;
  // might be removed I will just replace the <proxyContext> in the entire JS file  I am importingproxyGlobalContext: string;
  overwriteRecords?: overwriteRecordsType;
}
type proxifiedObjType = revokableProxyRet | proxifiyObjGenerator;
type proxifiyObjGenerator = (
  ctx: proxifiedObjGeneratorContext
) => proxifiedObjType;
type proxifyGetter = (ctx: proxifiedObjGeneratorContext) => any;

type objectPropertyModifier = (ctx: proxifiedObjGeneratorContext) => void;

/** This is a generic type interface used for intersection in other interfaces below */
interface APIInterceptorGeneric {
  /** This object path that excludes global objects and overwrites the property. *AeroSandbox* will also check if it exists in the global context. This is necessary if `proxifiedObjWorkerVersion` is set.
   * This is done so that if the api is only exposed to the window it will overwrite it on the window object specifically or else it would use self since that is also covered by the global context of windows and workers. THe reason why this is done is because I want an error to be thrown if a window API is mistakingly used in a worker's global scope.
   * TODO: Throw an error in AeroSandboxBuilder error if globalProp contains "<global context>.<props>"
   * NOTE: <proxyNamespace> is substituted with the proxyNamespace in the AeroSandboxConfig
   * @warning It will overwrite the entire global scope with your proxified object if you set it to `""`.
   */
  globalProp: string | "";
  /** These toggle code inside of the Proxy handler that provide other things you may want to use AeroSandbox for */
  specialInterceptionFeatures?: InterceptionFeaturesEnum;
  /** This is if your API Interceptor covers WebSockets, WebTransports, or WebRTC */
  forAltProtocol?: AltProtocolEnum;
  /* Aero uses self.<apiName> to overwrite the proxified object, but if the API is exclusively for the window, it uses window.<apiName> */
  exposedContexts?: ExposedContextsEnum;
  supports?: SupportEnum;
  /** This number determines how late the API injectors will be injected. It is similar to the index property in CSS. If not set, the default is zero. */
  insertLevel?: number;
}
type APIInterceptorForProxyObjects = APIInterceptorGeneric & {
  /** This is specifically for objects that use the ES6 Proxy Object or re-implement the API from scratch. proxifiedObjGenFunc is a handler which returns the proxified object depending on the context given, which is determined by how the AeroSandboxBundler class is configured with the config in the constructor.*/
  proxifiedObj?: Object | proxifiyObjGenerator;
  exposedContexts: anyWorkerEnumMember;
};
type APIInterceptorForProxyObjectsInWorker = APIInterceptorGeneric & {
  proxifiedObjWorkerVersion?: Object;
  exposedContexts: anyWorkerEnumMember;
};
type APIInterceptorForProxifiyingGetters = APIInterceptorGeneric & {
  proxifyGetter?: proxifyGetter;
};
type APIInterceptorForModifyingObjectProperties = APIInterceptorGeneric & {
  /** This is for overwriting properties with the `Object` type class  */
  modifyObjectProperty: objectPropertyModifier;
};
// TODO: Make it possible in AeroSandbox to view the API Interceptor and determine if it should be included in AeroSandbox or not with a handler
/** This is what is exported in every API Interceptor. Omitting any of the properties with the Enum type will act as if every member of the Enum is present. */
type APIInterceptor =
  | APIInterceptorForProxyObjects
  | APIInterceptorForProxyObjectsInWorker
  | APIInterceptorForProxifiyingGetters
  | APIInterceptorForModifyingObjectProperties;

// These enums are inspired by the WebIDL spec
enum SupportEnum {
  deprecated,
  nonstandard,
  draft,
  shippingChromium,
  originTrialExclusive,
}
enum ExposedContextsEnum {
  dedicatedWorker,
  sharedWorker,
  audioWorklet,
  animationWorklet,
  layoutWorklet,
  sharedStorageWorklet,
  paintWorklet,
  serviceWorker,
  window,
}
type anyWorkerEnumMember =
  | ExposedContextsEnum.animationWorklet
  | ExposedContextsEnum.audioWorklet
  | ExposedContextsEnum.dedicatedWorker
  | ExposedContextsEnum.layoutWorklet
  | ExposedContextsEnum.paintWorklet
  | ExposedContextsEnum.serviceWorker
  | ExposedContextsEnum.sharedStorageWorklet
  | ExposedContextsEnum.sharedWorker;
enum AltProtocolEnum {
  webRTC,
  webSockets,
  webTransport,
}

enum InterceptionFeaturesEnum {
  /** This member requires the correct context to be passed down in the proxy's global context */
  corsEmulation,
  /** This member requires the correct context to be passed down in the proxy's global context */
  cacheEmulation,
  privacySandbox,
  /** Using this member adds code to the navigator.serviceWorker API interceptor to support nestedWorkers. If you enable it and don't have the supplementing SW code for it, it gives up on waiting for a message response back and throws an error. **/
  nestedSWs,
  /** This feature is nowhere near being finished; **do not enable** */
  swLess,
  aerogel,
  /** Only use this if you aren't using Custom Element "is" interception */
  elementConcealment,
  errorConcealment,
  messageIsolation,
  /** Only use this member if you aren't using it for a regular SW proxy */
  requestUrlProxifier,
}
