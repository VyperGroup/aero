import { getBrowserData, sendBrowserData } from "./util/browserData";

import getApiProps from "./util/getApiProps";

// @ts-ignore
browser.browserSettings = {};

// This was a more primitive version of what I had
(async () => {
	for await (const setting of getApiProps("browserSettings")) {
		browser.browserSettings[setting] = {
			get: async () => await getBrowserData(`GET_SETTINGS_${setting}`),
			set: async details =>
				sendBrowserData(`SET_SETTINGS_${setting}`, details),
			clear: async () => sendBrowserData(`SET_SETTINGS_${setting}`, null),
		};
	}
})();
