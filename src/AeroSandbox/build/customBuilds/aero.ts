import { defaultSWProxyFeatures } from "../featureMembers";

import config from "$aero/config";

import AeroSandbox from "../AeroSandboxBuilder";

const buildConfig = {
  proxyConfig: {
    ...config,
  },
  specialInterceptionFeatures: defaultSWProxyFeatures,
};

const fakeOriginSettings = ["all", "all", "none"];

export { buildConfig, fakeOriginSettings };

export default new AeroSandbox(buildConfig).fakeOrigin(...fakeOriginSettings);
