if ($aero.config.flags.emulateSecureContext) {
	const bak = isSecureContext;

	Object.defineProperty(window, "isSecureContext", {
		get: () => $aero.proxyLocation.protocol === "https:" || bak,
	});
}
