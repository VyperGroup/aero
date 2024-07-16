# JS Sandboxing - DRAFT 📝

TODO: Bring back parts of the old version of this doc

> ⚠️ WARNING: This document is highly out of date; please don't read it. It will be updated soon.

## AeroGel 🏆

TODO: Finish writing this section

## DSPC

## Traditional JS parsing

AST is inefficient because you have to copy everything and keep track of it in a tree
It is better to rewrite as you go, but that is impossible with JS because you don't know what is next since it is a scripting language. That is why I use half-parse methods in AeroGel and DPSC.

## ShadowRealm

[ShadowRealm](https://github.com/tc39/proposal-shadowrealm/blob/main/explainer.md) is an upcoming browser API that will allow you to modify the realm of JS, basically allowing you to control the scope more easily than before.

We can actually use it right now!

The essence of the [polyfill](https://github.com/ambit-tsai/shadowrealm-api) works is basically binding a prototype version of the window object that has been modified to be proxified. This polyfill works exactly like aero gel, but it uses the ShadowRealm API, which is only available on the [Safari Technology Preview](https://developer.apple.com/safari/technology-preview)

### Example

// proxyRealmLocation.ts (aero.sandbox.proxyRealm.js)

```ts
import { proxyLocation } from "$src/interceptors/loc/location";

fakeLocation = proxyLocation();

export { fakeLocation };
```

// proxyRealm.ts

```ts
const proxyRealm = new ShadowRealm();

const proxyWin = await realm
  .importValue("./aero.sandbox.proxyRealmLocation.js", "location")
  .then(() => {});
```

And then in every script you run the script inside of the realm. The elipses denote where the original src go

```ts
proxyWin.evaluate("...");
```

### The issue here

Using the ShadowRealm would require a module script that the browser would fetch. You would have to delay the site loading until you set up your sandbox, waste resources rewriting scripts to wrap them in the sandbox, and finally use API interceptors to make the changes to those scripts undetectable. To set up the sandbox, you need to wait for a promise to import the values, and it needs to fetch an ES6 module, so we would have to wait for it to import a whole copy of the window into it and then inject the HTML into the site. By the way, the ShadowRealm polyfill works similarly to AeroGel. Still, it is heavier because it requires more scoped.
