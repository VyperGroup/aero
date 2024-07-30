import sharedConfig from "./sharedConfig";

import { afterPrefix } from "./getProxyUrl";

const proxyLocation = () => new URL(afterPrefix(location.href));
const upToProxyOrigin = () => sharedConfig("prefix") + proxyLocation().origin;

export { proxyLocation, upToProxyOrigin };
