import { prefix } from "$aero_config";

export default (url: string) =>
	new Response("", {
		status: 307,
		headers: {
			location: prefix + url,
		},
	});
