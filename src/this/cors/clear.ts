import { prefix, flags } from "config";

export default async (
	clear: string[],
	id: string,
	proxyUrl: URL
): Promise<void> => {
	if (clear.includes("'*'") || clear.includes("'cache'"))
		await caches.delete(proxyUrl.origin);
	// Send messages to all windows with the same origin to reload
	if (
		(flags.misc && clear.includes("'*'")) ||
		clear.includes("executionContexts")
	) {
		const client = await clients.get(id);

		const clientOrigin = new URL(
			client.url.replace(new RegExp(`^(${prefix})`, "g"), "")
		).origin;

		if (clientOrigin === proxyUrl.origin)
			client.postMessage("clearExecutionContext");
	}
};
