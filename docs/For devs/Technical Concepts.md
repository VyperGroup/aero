# How aero works

## Resources

* [How sandboxing works](../../src/AeroSandbox/docs/Index.md)

## Precedence

Previously, proxies could barely handle more than one person, this was due to all the site's code being rewritten on the backend. Because the code was being rewritten on the backend, it required having to share backend rewrite code with frontend code. This was not only slow, but also allowed the possibility of Slowloris attacks against the proxies.

## Interception

aero took a different approach by doing all the rewrites on the frontend with no heavy parsing; this allows aero to avoid speed delays! In an interception it's important to have no rewriting on the backend, and as minimal as possible rewriting on the service worker.

## Extensibility

One of aero's strengths is its **Extensibility**. This is done by making aero readable and customizable by anyone. Every aspect of it is documented. Even if you are not a programmer, you can understand how aero works. We may provide multiple modules for a single purpose: not one solution is good for everybody. There are configs to control functionality - in order to have no compromises and allow those who can't write code to easily customize it. If you are a programmer, you will appreciate all the hooks and guiding variables we have to easily modify the code. We are also working on alternative backends to better deploy aero in specific scenarios.

## Types of Interception

## Types of emulation

### Network-based

We emulate certain CORS headers that we can't replace with CORS Testing

#### [Cache Emulation](./Cache.md##)

## Rewriters

### Cache Manifest

aero rewrites the paths in the cache manfiests files using the rewriteSrc module

## Other Concepts

### [CORS Testing](https://github.com/ProxyHaven/aero/blob/main/this/cors/test.ts)

Aero sends a ghost request to the site without the proxy, in order to check if the request would be blocked under cors conditions

### [Less bandwidth method](https://github.com/ProxyHaven/aero/blob/main/this/cors/testNoReq.ts) _Incomplete_

This will check the proxy url through the [policy module](https://github.com/ProxyHaven/aero/blob/main/browser/misc/policy.ts). This is available as an alternative module.
