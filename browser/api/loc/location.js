Object.defineProperty($aero, "location", {
	value: $aero.locationProxy,
});

Object.defineProperty(document, "domain", {
	get: () => $aero.proxyLocation.hostname,
});
Object.defineProperty(document, "URL", {
	get: () => $aero.proxyLocation.href,
});
