import type { AeroSandboxFeaturesConfig } from "../../../types/aeroSandbox.js";
import { defaultSWProxyFeatures } from "../../../types/featureMembers.js";
import type { BuildConfig } from "../../../types/buildConfig";

export default {
	proxyNamespaceObj: "$aero",
	aeroSandboxNamespaceObj: "$sandbox",
	configKey: "config",
	featuresConfig: {
		/** These enum members enable code inside of the Proxy handler that provide other things you may want to use AeroSandbox for */
		specialInterceptionFeatures: defaultSWProxyFeatures
	}
} as BuildConfig;
