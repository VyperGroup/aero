import { compiled } from "./config.json";

import replaceAsync from "string-replace-async";

export default async function formatXHTML(
	text: string,
	full: string,
	htmlMode = true,
): Promise<string> {
	let ret = "";
	if (compiled) {
		ret = (
			await replaceAsync(
				// Get rid of preprocessor statements
				text.replace(/(\#ifdef).*?(\#endif)/gms, ""),
				/#include (.+)/g,
				// Imports
				async (_match, g1) => {
					return await (
						await fetch(new URL(g1, full + "content/").href)
					).text();
				},
			)
		)
			.split("\n")
			.filter(line => !line.startsWith("#"))
			.join("\n");
	}
	if (htmlMode) {
		ret = ret.replace(
			/^<\?xml-stylesheet href="(.+)" type="text\/css"\?>/gm,
			'<link rel="stylesheet" href="/$1">',
		);
		ret = `
${ret}`;
	}

	return ret;
}
