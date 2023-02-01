import rewriteSrc from "../../shared/src.js";

export default (prefix, body) => {
	const json = JSON.parse(body);

	json.scope = rewriteSrc(prefix, json.startUrl);
	json.start_url = rewriteSrc(prefix, json.start_url);

	for (icon of json.icons) icon.src = rewriteSrc(prefix, icon.src);
	for (handlers of json.protocol_handlers)
		handlers.src = rewriteSrc(prefix, handlers.src);
	for (apps of json.related_application)
		apps.src = rewriteSrc(prefix, apps.src);

	return JSON.stringify(json);
};
