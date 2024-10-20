import type { ExtraAPIs, AeroSandboxFeaturesConfig } from "../../types/aeroSandbox.d.ts";

import { defaultSWProxyFeatures } from "../../types/featureMembers";

export default {
	/** These enum members enable code inside of the Proxy handler that provide other things you may want to use AeroSandbox for */
	featuresConfig: {
		specialInterceptionFeatures: defaultSWProxyFeatures
	}
} as AeroSandboxFeaturesConfig;
