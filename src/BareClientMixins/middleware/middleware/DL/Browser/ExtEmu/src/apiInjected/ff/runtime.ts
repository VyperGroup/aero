function getPlatform(platform): browser.runtime.PlatformOs {
	if (platform === "macOS") return "mac";
	if (platform === "Windows") return "win";
	if (platform === "Chromium OS") return "cros";
	return platform.toLowerCase();
}

const bcPlat = new BroadcastChannel("EXT_GET_PLATFORM");
bcPlat.onmessage = e =>
	(navigator as any).userAgentData.platform
		? bcPlat.postMessage(
				getPlatform((navigator as any).userAgentData.platform),
			)
		: null;

const uaMap = new Map<string, string>()
	.set("Mac", "mac")
	.set("Linux", "linux")
	.set("Android", "android")
	.set("CrOS", "cros");

// Fallback
let platform: browser.runtime.PlatformOs = "win";
for (const [match, plat] of uaMap.entries())
	if (navigator.userAgent.indexOf(match)) platform = plat;

const bcPlatUA = new BroadcastChannel("EXT_GET_PLATFORM_UA");
bcPlatUA.onmessage = e => bcPlatUA.postMessage(platform);
