export default (url: string) =>
	new Response("", {
		status: 307,
		headers: {
			location: $self.config.prefix + url
		}
	});
