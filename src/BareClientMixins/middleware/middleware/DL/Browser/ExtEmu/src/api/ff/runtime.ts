import ffAutoGen from "./util/ffAutoGen";

import { getBrowserData, sendBrowserData } from "./util/browserData";

(async () => {
	await ffAutoGen("runtime");

	const uaPlatform = await getBrowserData("PLATFORM", true);
	const uaPlatformUA = await getBrowserData("PLATFORM_UA", true);

	browser.runtime.getBackgroundPage = async (): Promise<Window> => {
		// TODO:  Make a window proxy to the background page
		// Placeholder
		return new Window();
	};
	browser.runtime.openOptionsPage = async () =>
		await sendBrowserData("OPEN_OPTIONS_PAGE");
	browser.runtime.sendMessage = async (extId, msg) =>
		await sendBrowserData("OS_MSG_APP_" + extId, msg);
	browser.runtime.sendNativeMessage = async (app, msg) =>
		await sendBrowserData("OS_MSG_APP_" + app, msg);
	browser.runtime.getPlatformInfo = async () => {
		const os = uaPlatformUA ?? uaPlatform;
		const platformInfo: browser.runtime.PlatformInfo = {
			os,
			// There is no way of obtaining this information, so it must be guessed
			arch: os === "android" || os === "ios" ? "arm" : "x86-64",
		};

		return platformInfo;
	};
})();
// TODO: ...
