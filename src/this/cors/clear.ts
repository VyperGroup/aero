import { prefix, flags } from "$aero_config";

export default async (
	clear: string[],
	client,
	proxyUrl: URL
): Promise<void> => {
	if (clear.includes("'*'") || clear.includes("'cache'"))
		await caches.delete(proxyUrl.origin);
	// Send messages to all windows with the same origin to reload
	if (
		(flags.misc && clear.includes("'*'")) ||
		clear.includes("executionContexts")
	) {
		const clientOrigin = new URL(
			client.url.replace(new RegExp(`^(${prefix})`, "g"), "")
		).origin;

		if (clientOrigin === proxyUrl.origin)
			client.postMessage("clearExecutionContext");
	}
};
