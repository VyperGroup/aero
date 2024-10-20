import { getProxyConfig } from "$util/getConfig";

import { proxyLocation } from "./proxyLocation";

export default () => getProxyConfig().prefix + proxyLocation().origin;
