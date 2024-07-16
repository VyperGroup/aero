# How to use aero

> ⚠️ WARNING: This document is highly out of date; please don't read it. It will be updated soon.

## _Coming soon, you will be able to add aero to your proxy automatically with aero-cli_

## Aero is API-compatible with UV

Alternatively instead of following these steps, you may simply replace UV's files with aero. **If you know how to setup UV, you know how to setup Aero and you don't need these instructions**

## Manual

### Foreword

Make sure your proxy site supports HTTP (unsecure), if you are seeking 100% site support. Eventually, with the advent of HTTP Emulation you won't need to do this.

### Configuring

Optionally, you can create a file that exports a config with your own options in src/config.ts rather than the ones automatically provided in src/defaultConfig.ts. Any option that is not set will fallback to the default config.

### Procedures

1. Ensure your backend serves a [TompHTTP-compatible backend](https://github.com/tomphttp)
2. Build aero with `pnpm run buildRs` or GH Actions _soon_ and serve the builds as aero/
3. Create a service worker like [this](https://github.com/ProxyHaven/aero-site/blob/main/sw.js) in the static topmost directory
4. Register the service worker in a script on your main page (not on your backend) like this
   _This example uses our [sdk](https://github.com/ProxyHaven/aero-sdk); allowing you to safely manage deployments of multiple proxies, and supports dynamic config updates_

```js
import { prefix } from "./aero/config.js";

import ProxyManager from "./sdk/ProxyManager.js";

const proxyManager = new ProxyManager();

proxyManager.add("/sw.js", prefix);
```
