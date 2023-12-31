// This is very outdated

import { getBrowserData, sendBrowserData } from "util/browserData";
import { fwdMsg } from "./util/Listener";

// @ts-ignore
browser.theme = {};

(async => {
	await ffAutoGen("theme");

	browser.theme.getCurrent = async () => await getBrowserData("GET_THEME");
	//browser.theme.update = (windowId, theme) => sendBrowserData("SET_THEME", { windowId, theme });
	browser.theme.reset = windowId =>
		sendBrowserData("SET_THEME", { windowId, theme: null });
})();

fwdMsg(browser.theme, "onUpdated", "THEME_UPDATED");
