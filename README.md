# What is aero?

Aero an innovative, first of its kind, interception-based web proxy from 2021, is now being open sourced! Aero has the best site compatibility and is the fastest proxy by far.

# What is the purpose?

Aero was created out of the necessity for a proxy that can scale to millions of users. I want aero to be as easy to understand as possible being a great example of how a proxy should be made, while being modular and easy to modify or customize.

# How is aero different from previous proxies?

## Historical Context

Previously, proxies could barely handle more than one person, this was due to all the site's code being rewritten on the backend. Because the code was being rewritten on the backend, it required having to share backend rewrite code with frontend code. This was not only slow, but also allowed the possibility of malicious attacks against the proxies.

## Difference

Aero takes a different approach by not only completely avoiding rewrites, but also by doing all the rewrites on the frontend with no parsers! This allows the response times to be O(1) with no speed delay. It does this by intercepting requests through a service worker, where the request is routed to the while also injecting important scripts. This prevents the need to hook into code that previously needed to be rewritten to redirect requests saving time and resources.

## HTML Interception

HTML is intercepted and rewritten through a Mutation Observer where important elements are rewritten. Script elements with inline code and elements with integrity values set need to be cloned due to the browser's security restrictions.

## Deep Scope Property Checking

Location objects are replaced with a fake Location api, and also in the case of the site trying to escape the location scoping bracket property accessors for certain objects are checked using our scope function that evaluates the expression in hopes of intercepting the attempted location or window call. Additionaly, this scoping is integrated into Eval, Function Class, and Reflect hooks. *Support for this feature is enabled in flags*

## Cors Emulation

Unlike other proxies that simply delete the cors policy and ignore it, aero abides by the intended security features by keeping them in place. Without Cors Emulation, sites can infer either the browser doesn't support modern security standards or that a proxy is being used. This means that the site would've been lacking support; no longer with aero! This isn't fully complete yet, as we still have more rules to finish. *Support for this feature is enabled in flags*

# Why doesn't aero work on iOS?

The bug is Apple's fault not ours, since Safari doesn't support the Service Worker standard. This would normally be fine in most mobile operating systems but due to the restrictions apple imposes on the apps, browsers are forced to use Safari's engine.

# How do I use aero?

1. Make sure your backend serves aero's [backend](https://git.semisol.dev/Haven/aero-backend) correctly
2. Make sure you included aero into your site
3. Create a config like this **named config.js**
   _⚠️ Enabling flags may result in more bugs due to unfinished compatibility_

```js
const aeroPrefix = "/aero/";
const prefix = "/go/";
const proxyApi = "/fetch";
const proxyApiWs = "/fetchWs";
// For experimental features
const flags = {
	advancedScoping: false,
	corsEmulation: false,
	nestedWorkers: false,
	wrtc: false,
};
const debug = {
	url: false,
	src: false,
	scoping: false,
};

export { aeroPrefix, prefix, proxyApi, flags, debug };
```

4. Create a service worker like this in the topmost directory

```js
import handle from "./aero/handle.js";

self.addEventListener("install", event => self.skipWaiting());

self.addEventListener("fetch", async event =>
	event.respondWith(
		handle(event).catch(err => new Response(err.stack, { status: 500 }))
	)
);
```

5. Register the service worker in a script on your main page like this
   _This example uses our [sdk](https://git.semisol.dev/ProxyHaven/sdk)_

```js
import registerSw from "./sdk/registerSw.js";

registerSw("/sw.js", prefix);
```
