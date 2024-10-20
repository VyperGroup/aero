import getConfig from "$util/getConfig";

import { afterPrefix } from "./getProxyUrl";

getPropFromTree(AERO);
const proxyLocation = () => new URL(afterPrefix(location.href));
const upToProxyOrigin = () => getConfig().prefix + proxyLocation().origin;

export { proxyLocation, upToProxyOrigin };
