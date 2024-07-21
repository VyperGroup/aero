import prefix from "$aero/config";

import locationProxy from "$sandbox/proxyLocation";
import { upToProxyLocation } from "util/upToProxyLocation";

// Prevent detection by instanceof
let inheritedObject = {};
Reflect.setPrototypeOf(inheritedObject, Location.prototype);

window["$location"] = locationProxy;
window["$location"]["Symbol.toStringTag"] = "Location";

Object.defineProperty(document, "domain", {
  get: () => $location.hostname,
});
Object.defineProperty(document, "URL", {
  get: () => $location.href,
});
