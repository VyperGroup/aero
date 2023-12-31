import osExtras from "$aero_config";

// @ts-ignore
browser.captivePortal = {};

if (osExtras) {
} else {
	Object.defineProperty(browser.captivePortal, "canonicalURL", {
		value: "",
		writable: true,
	});

	// There is no reason to support this
	browser.captivePortal.getLastChecked = async () => 0;
	browser.captivePortal.getState = async () => "unknown";
}
