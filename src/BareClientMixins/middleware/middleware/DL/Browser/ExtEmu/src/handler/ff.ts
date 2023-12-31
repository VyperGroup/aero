import extractZip from "../util/extractZip";

export default async (e: MessageEvent) => {
	const resp = await fetch(e.data);

	if (resp.headers.get("content-type") === "application/x-xpinstall") {
		// xpi is simply a zip file in disguise
		const files = await extractZip(await resp.arrayBuffer());

		if (files) {
			const manifestRaw = files.get("manifest.json");
			if (manifestRaw) {
				const manifest = JSON.parse(manifestRaw);
				if ("background" in manifest) {
					const background = files.get(manifest.background);
					if (background)
						// Eval
						new Function(background)();
				}
			}
		}
	}
};
