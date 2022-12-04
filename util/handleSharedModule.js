import headersToObject from "./headersToObject.js";

export default async event => {
	const resp = await fetch(event.request.url);

	if (!resp.headers.get("content-type").startsWith("application/javascript"))
		return resp;

	const body = await resp.text();

	// Remove the last line
	return new Response(
		body
			.split("\n")
			.filter(
				line =>
					!(line.startsWith("import") || line.startsWith("export"))
			)
			.join("\n"),
		{
			status: resp.status,
			headers: headersToObject(resp.headers),
		}
	);
};
