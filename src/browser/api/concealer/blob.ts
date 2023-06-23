// @ts-ignore
// @ts-nocheck

import proxy from "shared/autoProxy/autoProxy";

import isHtml from "../shared/isHTML";

proxy(
	"Blob",
	new Map().set(0, (blobParts: BlobPart[], opts: BlobPropertyBag) => {
		if (isHtml(opts.type))
			return blobParts.map(html => globalThis.$aero.init + html);
	}),
	(res, blobParts: BlobPart[]) => {
		let size = 0;

		blobParts.forEach(html => (size += html.length));

		return (res.size = size);
	}
);
