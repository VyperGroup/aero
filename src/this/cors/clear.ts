import config from "$aero_config";
const { prefix, flags } = config;

type ClientType = any; // Replace 'any' with the actual type of 'client'
type URLType = URL; // Replace 'URL' with the actual type of 'proxyUrl' if it's different

const clearCache = async (
	clear: string[],
	proxyUrl: URLType
): Promise<void> => {
	if (clear.includes("'*'") || clear.includes("'cache'"))
		await caches.delete(proxyUrl.origin);
};

const clearExecutionContexts = async (
	clear: string[],
	client: ClientType,
	proxyUrl: URLType
): Promise<void> => {
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

export default async (
	clear: string[],
	client: ClientType,
	proxyUrl: URLType
): Promise<void> => {
	await clearCache(clear, proxyUrl);
	await clearExecutionContexts(clear, client, proxyUrl);
};
