import proxy from "$aero/shared/autoProxy/autoProxy";

import isHtml from "$aero/shared/isHTML";

proxy(
	"Blob",
	new Map().set(0, (blobParts: BlobPart[], opts: BlobPropertyBag) => {
		if (opts && isHtml(opts.type))
			return blobParts.map(html => $aero.init + html);
	}),
	(res, blobParts: BlobPart[]) => {
		let size = 0;

		blobParts.forEach(html => {
			if (html instanceof ArrayBuffer) size += html.byteLength;
			if (html instanceof Blob) size += html.size;
			if (typeof html === "string") size += html.length;
		});

		return (res.size = size);
	},
);
