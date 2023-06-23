import locationProxy from "browser/misc/proxyLocation";

globalThis.$location = locationProxy;
globalThis.$location["Symbol.toStringTag"] = "Location";

Object.defineProperty(document, "domain", {
	get: () => globalThis.$location.hostname,
});
Object.defineProperty(document, "URL", {
	get: () => globalThis.$location.href,
});
