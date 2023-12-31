import { BlobReader, TextWriter, ZipReader } from "@zip.js/zip.js";

export default async (
	zip: ArrayBuffer,
): Promise<Map<string, string> | false> => {
	const reader = new BlobReader(new Blob([zip]));

	const zipReader = new ZipReader(reader);

	const files = new Map();

	const entries = await zipReader.getEntries();

	for (const entry of entries) {
		const writer = new TextWriter();

		if (entry.getData) {
			files.set(entry.filename, await entry.getData(writer));
		}
	}

	await zipReader.close();

	return files;
};
