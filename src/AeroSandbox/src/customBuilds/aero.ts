import { defaultSWProxyFeatures } from "../featureMembers";

import config from "$aero/config";

import AeroSandbox from "$src/AeroSandbox";

new AeroSandbox({
	proxyConfig: {
		...config,
	},
	specialInterceptionFeatures: defaultSWProxyFeatures,
}).fakeOrigin("all", "all", "none");
