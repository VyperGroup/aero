import { UVRewriterWorkerMembers } from "$types/customBuilds";
import type { UVConfig } from "@titaniumnetwork-dev/ultraviolet";

import { defaultProxyFeatures } from "../../build/featureMembers";

import AeroSandbox from "../AeroSandboxBuilder";

let __uv$config: UVConfig;

const buildConfig = {
	proxyConfig: {
		encodeUrl: __uv$config.encodeUrl,
		decodeUrl: __uv$config.decodeUrl
	},
	specialInterceptionFeatures: defaultProxyFeatures
};

const fakeOriginSettings = ["all", UVRewriterWorkerMembers, "none", true];

export { buildConfig, fakeOriginSettings };

export default new AeroSandbox(buildConfig).fakeOrigin(...fakeOriginSettings);
