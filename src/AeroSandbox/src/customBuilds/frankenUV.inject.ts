import { UVRewriterMembers } from '$aero/types';

import type { UVConfig } from "@titaniumnetwork-dev/ultraviolet";

import { defaultProxyFeatures } from '../featureMembers';

var __uv$config: UVConfig;

new AeroSandbox({
  proxyConfig: {
    encodeUrl: __uv$config.encodeUrl,
    decodeUrl: __uv$config.decodeUrl,
  },
  specialInterceptionFeatures: defaultProxyFeatures
}).fakeOrigin(
  "all",
  UVRewriterMembers,
  "none"
});
