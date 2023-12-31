import mime from "mime/lite";
import Jimp from "jimp/es";

// TODO: Install the icons in a store with indexeddb
// TODO: After achieving the store, correctly use the size that is closest
const size = 64;
// ext, mimeIconUrl
const iconPacks = new Map<string, string>()
	// KDE has native web support https://github.com/KDE/breeze-icons/blob/master/webfont/Gruntfile.js
	.set(
		"Adwaita",
		`https://raw.githubusercontent.com/KDE/breeze-icons/master/icons/mimetypes/${size}/`,
	);
// type, size (integer)
const sizes = new Map<string, number>()
	.set("button", -1)
	.set("toolbar", -1)
	.set("toolbarsmall", -1)
	.set("menu", -1)
	.set("dialog", -1);

async function getImg(
	contentType: string,
	size?: number | "button" | "toolbar" | "toolbarsmall" | "menu" | "dialog",
	// TODO: Respect state
	state?: "normal" | "disabled",
) {
	const img = await fetch(iconPacks.get("Adwaita") + contentType + ".svg");
	if (size) return (await Jimp.read(img)).resize(size);
	else return img;
}

// https://searchfox.org/mozilla-central/source/__GENERATED__/dist/xpcrs/rt/nsIIconURI.rs#18
export default async (url: URL): Promise<Response | void> => {
	if (url.hostname === "stock") {
		// TODO: Implement; I can't implement this yet until icon saving is implemented
	} else {
		const size = parseInt(url.searchParams.get("size"));

		const contentType = url.searchParams.get("contentType");
		if (contentType) return await getImg(contentType, size);

		const ext = mime.getExtension(url.pathname);
		if (ext) {
			const state = url.searchParams.get("state");
			if (state === "normal" || state === "disabled")
				return await getImg(ext, size, state);
			return await getImg(ext, size);
		}
	}
};
