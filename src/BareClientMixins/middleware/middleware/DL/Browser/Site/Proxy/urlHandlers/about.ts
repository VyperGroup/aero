import handleChromeUrl from "./chromeUrl";

export default async (url: URL): Promise<Response | void> => {
	const text = await (
		await fetch(
			"https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/about/AboutRedirector.cpp",
		)
	).text();

	// TODO: Parse this C++ with https://github.com/binji/wasm-clang
	for (const match of text.matchAll(
		/{"([a-z-]+)",\s*"(chrome:\/\/[a-zA-Z-\/]+\.x?html|about:[a-z]+)",((?:\s*nsIAboutModule::[A-Z_]*(?: \|)?)*|\s*ACTIVITY_STREAM_FLAGS)\}/gs,
	)) {
		try {
			const chromeUrl = new URL(match[1].trim());

			const aboutName = match[0].trim();
			// TODO: Respect flags
			const flags = match[2].trim();

			if (chromeUrl.hostname === aboutName) {
				const ret = handleChromeUrl(new URL(chromeUrl));
				if (ret) resp = ret;
			}
		} catch {}
	}
};
