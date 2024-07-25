import type { UVConfig } from "@titaniumnetwork-dev/ultraviolet";

import { defaultProxyFeatures } from "../featureMembers";

import AeroSandbox from "../AeroSandboxBuilder";

enum UVRewriterMembers {}

let __uv$config: UVConfig;

const buildConfig = {
	proxyConfig: {
		encodeUrl: __uv$config.encodeUrl,
		decodeUrl: __uv$config.decodeUrl
	},
	specialInterceptionFeatures: defaultProxyFeatures
};

const fakeOriginSettings = ["all", UVRewriterMembers, "none"];

export default new AeroSandbox(buildConfig).fakeOrigin(...fakeOriginSettings);
