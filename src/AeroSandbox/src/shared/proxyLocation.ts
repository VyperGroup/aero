import sharedConfig from "./sharedConfig";

import { afterPrefix } from "./getProxyUrl";

const proxyLocation = () => new URL(afterPrefix(location.href));
const upToProxyOrigin = () => sharedConfig("prefix") + proxyLocation().origin;

Object.defineProperty(document, "domain", {
	// @ts-ignore
	get: () => locationProxy.hostname
});
Object.defineProperty(document, "URL", {
	// @ts-ignore
	get: () => locationProxy.href
});

export { proxyLocation, upToProxyOrigin };
