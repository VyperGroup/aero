# JS Sandboxing

> We don't support rewriters on aero anymore

## Aero gel (preferred)

TODO: Finish writing this section

## ShadowRealm

[ShadowRealm](https://github.com/tc39/proposal-shadowrealm/blob/main/explainer.md) is an upcoming browser API that will allow you to modify the realm of JS, basically allowing you to control the scope more easily than before.

We can actually use it right now!

The essence of the [polyfill](https://github.com/ambit-tsai/shadowrealm-api) works is basically binding a prototype version of the window object that has been modified to be proxified. This polyfill works exactly like aero gel, but it uses the ShadowRealm API, which is only available on the [Safari Technology Preview](https://developer.apple.com/safari/technology-preview)

## Example

> I'm going to make a module in aero for this with the polyfill

// proxyRealmLocation.ts (aero.sandbox.proxyRealm.js)

```ts
import { proxyLocation } from "$aero_browser/misc/proxyLocation";

fakeLocation = proxyLocation();

export { fakeLocation };
```

// proxyRealm.ts

```ts
const proxyRealm = new ShadowRealm();

const proxyWin = await realm.importValue(
  "./aero.sandbox.proxyRealmLocation.js",
  "location"
);

realm.evalute(...)
```
