# How to use aero

1. Ensure your backend serves an [aero](https://github.com/ProxyHaven/aero-backends) _(recommended)_ or a [TompHTTP Compatible](https://github.com/tomphttp) Backend
   > If you are using bare, run bare.sh
2. Ensure you included aero into your site
3. Create a service worker like [this](https://github.com/ProxyHaven/aero-site/blob/main/sw.js) in the static topmost directory
   > If you already have other deployments of sw proxies and they are classic rather than module, register your sw as a module script, and replace importScripts(...) to import ...;
4. Register the service worker in a script on your main page (not on your backend) like this
   _This example uses our [sdk](https://github.com/ProxyHaven/aero-sdk); allowing you to safely manage deployments of multiple proxies, and supports dynamic config updates_

```js
import { prefix } from "./aero/config.js";

import ProxyManager from "./sdk/ProxyManager.js";

const proxyManager = new ProxyManager();

proxyManager.add("/sw.js", prefix);
```
