import rewriteSrc from "../shared/src.js";

function rewriteManifest(body) {
	const json = JSON.parse(body);

	json.scope = rewriteSrc(json.startUrl);
	json.start_url = rewriteSrc(json.start_url);

	for (icon of json.icons) icon.src = rewriteSrc(icon.src);
	for (handlers of json.protocol_handlers)
		handlers.src = rewriteSrc(handlers.src);
	for (apps of json.related_application) apps.src = rewriteSrc(apps.src);

	return JSON.stringify(json);
}

export default rewriteManifest;
