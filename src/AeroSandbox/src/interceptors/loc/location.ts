import locationProxy from "$shared/proxyLocation";

// Prevent detection by instanceof
let inheritedObject = {};
Reflect.setPrototypeOf(inheritedObject, Location.prototype);

window["$location"] = locationProxy;
window["$location"]["Symbol.toStringTag"] = "Location";

Object.defineProperty(document, "domain", {
	get: () => $location.hostname
});
Object.defineProperty(document, "URL", {
	get: () => $location.href
});
