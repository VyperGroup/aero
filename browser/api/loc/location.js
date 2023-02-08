Object.defineProperty($aero, "location", {
	value: $aero.locationProxy,
});

$aero.document = {};
Object.defineProperty($aero.document, "domain", {
	get: () => $aero.proxyLocation.hostname,
});
Object.defineProperty($aero.document, "URL", {
	get: () => $aero.proxyLocation.href,
});
