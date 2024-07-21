import prefix from "$aero/config";

import { proxyLocation } from "sandbox/src/proxyLocation";

export default () => prefix + proxyLocation().origin;
