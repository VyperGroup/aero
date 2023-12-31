import handleFFMount from "./Proxy/mount";

import { os } from "./config.json";

function getAfter(chromeUrl, path) {
	return chromeUrl.pathname.split(path).slice(-1).join();
}

export default async (url: URL): Promise<Response | void> => {
	try {
		let resp: Response;
		if (url.hostname === "browser") {
			if (url.pathname.startsWith("/skin/"))
				resp = await handleFFMount(
					getAfter(url, "/skin/"),
					"/browser/themes/shared/",
				);
			else resp = await handleFFMount(url.pathname, "/browser/base/");
		} else if (url.hostname === "global") {
			if (
				url.pathname.startsWith("/skin/") &&
				url.pathname.endsWith(".css")
			)
				resp = await handleFFMount(
					getAfter(url, "/skin/"),
					`/toolkit/themes/${os}/global/`,
				);
			else if (url.pathname.startsWith("/content/"))
				resp = await handleFFMount(
					getAfter(url, "/content/"),
					"/toolkit/content/",
				);
			else if (url.pathname.startsWith("/locale/"))
				resp = await handleFFMount(
					getAfter(url, "/locale/"),
					"/toolkit/locales/en-US/chrome/global/",
				);
			// /themes/shared/design-tokens-system.css
		} else if (url.hostname == "mozapps") {
			if (url.pathname.startsWith("/skin/"))
				resp = await handleFFMount(
					getAfter(url, "/skin/"),
					"/toolkit/themes/shared/",
				);
		}
	} catch {}
};
