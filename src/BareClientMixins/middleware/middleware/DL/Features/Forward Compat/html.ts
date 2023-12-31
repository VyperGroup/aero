import { HTMLMiddleware } from "mw";

import config from "./config";

import IsNotSupported from "./lib/IsNotSupported";
import getBrowserInfo from "./lib/getBrowserInfo";

import heic2any from "heic2any";
import { convertVideoToGIF } from "./lib/converters";

const browserInfo = getBrowserInfo();
const isNotSupported = new IsNotSupported(browserInfo);

// Integrations with various extension stores, where it intercepts the install button
const lib: HTMLMiddleware = {
	handle: el => {
		// TODO: In addition to HTML Interception I will also need to intercept a lot of JS such as Blobs

		if (el instanceof HTMLImageElement) {
			if (isNotSupported.check("heif"))
				fetch(el.src)
					.then(res => res.blob())
					.then(blob => {
						if (blob.type.startsWith("image/heic")) {
							return heic2any({
								blob,
								toType: "image/jpeg",
								// The type incorrectly mandates that this is true
								// @ts-ignore
								multiple: false,
							});
						}
					})
					.then(conversion => {
						// @ts-ignore
						el.src = URL.createObjectURL(conversion);
					});
		} else if (el instanceof HTMLVideoElement) {
			if (config.convertVideosToGifs) {
				const newEl = document.createElement("img");

				convertVideoToGIF(el.src).then(
					gifBlob => (newEl.src = URL.createObjectURL(gifBlob)),
				);

				replaceEl(el, newEl);
			}
		} else if (el instanceof HTMLLinkElement) {
			if (
				isNotSupported.check("link-icon-svg") &&
				el.rel === "icon" &&
				el.type === "image/svg+xml"
			) {
				// TODO: Check if svg
				const newEl = document.createElement("link");

				newEl.rel = "icon";
				// TODO: Add a search param to denote that it is a favicon, and in resp.ts, when it sees that search param in resp.ts, convert it to a ico instead

				replaceEl(el, newEl);
			}
		}
	},
};

function replaceEl(el: Element, newEl: Element) {
	el.parentNode.insertBefore(newEl, el);
	el.remove();
}

export default lib;
