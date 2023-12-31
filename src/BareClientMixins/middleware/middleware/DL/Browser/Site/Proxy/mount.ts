import config from "./config.json";

import mime from "mime/lite";

import formatXHTML from "./formatXHTML";

export default async function handleFFMount(
	path: string,
	base = "",
	htmlMode = true,
): Promise<Response> {
	const full = "https://hg.mozilla.org/mozilla-central/raw-file/tip" + base;

	const text = await (await fetch(full + path, config.fetchOpts)).text();

	// TODO: Use a library to get the correct mime type
	// https://wzrd.in/standalone/node-mime@latest
	return new Response(
		path.endsWith(".xhtml") // TODO: Import the XUL element bundle
			? await formatXHTML(text, full, true)
			: text,
		mime.getType(path.split(".").pop()),
	);
}
