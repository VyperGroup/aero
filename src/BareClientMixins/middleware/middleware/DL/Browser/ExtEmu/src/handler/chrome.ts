import extStore from "shared/extStore";

// TODO: Use import paths
import crxToZip from "../util/crxToZip";
import extractZip from "../util/extractZip";

export default async (e: MessageEvent) => {
	const resp = await fetch(e.data);

	if (resp.headers.get("content-type") === "application/x-chrome-extension") {
		const zip = await crxToZip(await resp.arrayBuffer());

		if (zip) {
			const files = await extractZip(zip);

			if (files) {
				const manifest: browser._manifest.WebExtensionManifest =
					JSON.parse(files.get("manifest.json"));

				if (manifest.permissions)
					extStore().setItem("perms", [
						...extStore().getItem("perms"),
						...manifest.permissions,
					]);
			}
		}
	}
};
