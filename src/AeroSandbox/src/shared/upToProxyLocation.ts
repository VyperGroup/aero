import prefix from "$aero_config";

import { proxyLocation } from "sandbox/src/proxyLocation";

export default () => prefix + proxyLocation().origin;
