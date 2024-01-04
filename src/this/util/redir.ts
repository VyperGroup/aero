import config from "$aero_config";
const { prefix } = config;

export default (url: string) =>
	new Response("", {
		status: 307,
		headers: {
			location: prefix + url,
		},
	});
