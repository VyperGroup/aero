import { prefix } from "../../config";

export default url =>
	new Response("", {
		status: 307,
		headers: {
			location: prefix + url,
		},
	});
