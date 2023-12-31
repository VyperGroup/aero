import rewriteSrc from "$aero/shared/hared/src";

export default (body: string, proxyUrl: URL): string => {
	const json = JSON.parse(body);

	json.scope = rewriteSrc(json.scope, proxyUrl.href);
	json.start_url = rewriteSrc(json.start_url, proxyUrl.href);

	for (const icon of json.icons)
		icon.src = rewriteSrc(icon.src, proxyUrl.href);
	for (const handlers of json.protocol_handlers)
		handlers.src = rewriteSrc(handlers.src, proxyUrl.href);
	for (const apps of json.related_application)
		apps.src = rewriteSrc(apps.src, proxyUrl.href);

	return JSON.stringify(json);
};
