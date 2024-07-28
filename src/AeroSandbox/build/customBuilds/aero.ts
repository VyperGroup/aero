import { defaultSWProxyFeatures } from "../featureMembers";

import AeroSandbox from "../AeroSandboxBuilder";

const buildConfig = {
	proxyConfig: {
		...self.config
	},
	specialInterceptionFeatures: defaultSWProxyFeatures
};

const fakeOriginSettings = ["all", "all", "none"];

export { buildConfig, fakeOriginSettings };

export default new AeroSandbox(buildConfig).fakeOrigin(...fakeOriginSettings);
