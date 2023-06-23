import { prefix } from "config";

export default (url: string) =>
	new Response("", {
		status: 307,
		headers: {
			location: prefix + url,
		},
	});
