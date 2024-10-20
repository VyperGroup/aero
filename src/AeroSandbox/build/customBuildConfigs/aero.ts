import type { AeroSandboxFeaturesConfig } from "../../types/aeroSandbox.d.ts";

import { defaultSWProxyFeatures } from "../../types/featureMembers";

export default {
	featuresConfig: {
		specialInterceptionFeatures: defaultSWProxyFeatures
	}
} as AeroSandboxFeaturesConfig;
