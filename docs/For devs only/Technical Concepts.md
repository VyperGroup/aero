# How aero works

## Dictionary (terms you should know to be a proxy dev)

- API interceptors - We use these in proxies, so that we can mimic the functionality of the unproxied site in our proxy. This works by essentially "intercepting" API calls that would otherwise reveal the identity of the site you are on. Interception mostly occurs with Proxy objects or sometimes methods on the Object class.
- Proxifying - Doing API interception with the ES6 Proxy object
- Concealers - This is a subset of API interceptors. These are API interceptors that prevent the origin from being detected. Any API interceptor that is not a concealer
- Auto API interception - TODO: ...
- Relay - In this codebase, relaying refers to sending messages back and forth, bouncing between multiple message channels

### Common misconceptions

- Server-only - When I say this I am usually referring to running the SW code in the web server instead.
- Backend - The code that the *user* doesn't see. Usually this refers to using different implementations of the same thing. For example, you may refer to a bare server as a bare backend. This is because there are varying implementations to the standard, however bare is not a backend proxy server, it is the *bare* proxy itself.

## Precedence

Previously, proxies could barely handle more than one person, this was due to all the site's code being rewritten on the backend. Because the code was being rewritten on the backend, it required having to share backend rewrite code with frontend code. This was not only slow, but also allowed the possibility of Slowloris attacks against the proxies.

## Interception

aero takes a different approach by doing all the rewrites on the frontend with no heavy parsing; this allows aero to avoid speed delays! In an interception it's important to have no rewriting on the backend, and as minimal as possible rewriting on the service worker.

## Extensibility

One of aero's strengths is **Extensibility**. This is done by making aero readable and customizable by anyone. Every aspect of it is documented. Even if you are not a programmer, you can understand how aero works. We may provide multiple modules for a single purpose: not one solution is good for everybody. There are configs to control functionality - in order to have no compromises and allow those who can't write code to easily customize it. If you are a programmer, you will appreciate all the hooks and guiding variables we have to easily modify the code. We are also working on alternative backends to better deploy aero in specific scenarios.

## Types of Interception

### Request Interception

It does this by intercepting requests through a service worker, where the request is routed to the while also injecting important scripts. This prevents the need to hook into code that previously needed to be rewritten to redirect requests saving time and resources. All of its conceptual methods are optimal.

### [HTML Interception](https://github.com/ProxyHaven/aero/blob/Unstable/src/browser/rewriters/html.ts)

HTML is intercepted and rewritten through a Mutation Observer where important elements are rewritten. Script elements with inline code and elements with integrity values set need to be cloned due to the browser's security restrictions.

### JS Interception

TODO: ...

## Types of emulation

### Network-based

We emulate certain CORS headers that we can't replace with CORS Testing

#### Cache Emulation

##### [HTTP Cache Emulation](https://github.com/ProxyHaven/aero/blob/Unstable/src/this/cors/CacheManager.ts)

HTTP caches are emulated by a system using aero's own cache stores. This allows us to have caches stored for a specific origin. This is important for support since Clear-Site-Data deletes every origin's cache making aero otherwise detectable.

#### Cors Emulation

Unlike other proxies that simply delete the cors policy and ignore it, aero abides by the intended security features by keeping them in place. Without Cors Emulation, sites can infer either the browser doesn't support modern security standards or that a proxy is being used. This means that the site would've been lacking support; no longer with aero! _Support for this feature is enabled in flags_

## Rewriters

### Cache Manifest

aero rewrites the paths in the cache manfiests files using the rewriteSrc module

## Other Concepts

### [CORS Testing](https://github.com/ProxyHaven/aero/blob/main/this/cors/test.ts)

Aero sends a ghost request to the site without the proxy, in order to check if the request would be blocked under cors conditions

### [Less bandwidth method](https://github.com/ProxyHaven/aero/blob/main/this/cors/testNoReq.ts) _Incomplete_

This will check the proxy url through the [policy module](https://github.com/ProxyHaven/aero/blob/main/browser/misc/policy.ts). This is available as an alternative module.
