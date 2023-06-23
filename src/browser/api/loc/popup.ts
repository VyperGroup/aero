import proxy from "shared/autoproxy/autoproxy"

import rewriteSrc from "shared/src";

import { proxyLocation } from "browser/misc/proxyLocation";

proxy("open", new Map().set(0, url => rewriteSrc(url, proxyLocation().href)))
