import proxy from "$aero/shared/autoProxy/autoProxy";

import rewriteSrc from "$aero/shared/src";

import { proxyLocation } from "$aero_browser/misc/proxyLocation";

proxy(
	"open",
	new Map().set(0, url => rewriteSrc(url, proxyLocation().href)),
);
