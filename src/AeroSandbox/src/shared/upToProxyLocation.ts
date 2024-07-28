import sharedConfig from "./sharedConfig";

import { proxyLocation } from "./proxyLocation";

export default () => sharedConfig("prefix") + proxyLocation().origin;
