import type { AeroSandboxBuildConfig } from "./types/aeroSandbox";

import rspack from "@rspack/core";

const snakeCaseMatch = /([a-z])([A-Z])/g;
const replacementSnakeCaseToUnderscoreCase = "$1_$2";

export default (config: {
	/* This is the most important feature flag */
	proxyNamespace: string;
	ourNamespace: string;
	configKey: string;
	buildConfig: AeroSandboxBuildConfig;
}) => {
	let featureFlags: { [key: string]: string } = {};
	for (const [key, val] of Object.entries(config)) {
		const camelCaseToFeatureFlagFmtKey = key
			.replaceAll(snakeCaseMatch, replacementSnakeCaseToUnderscoreCase)
			.toUpperCase();
		featureFlags[camelCaseToFeatureFlagFmtKey] = JSON.stringify(val);
	}
	for (const [key, val] of Object.entries(config.buildConfig)) {
		const camelCaseToFeatureFlagFmtKey = key
			.replaceAll(snakeCaseMatch, replacementSnakeCaseToUnderscoreCase)
			.toUpperCase();
		featureFlags[camelCaseToFeatureFlagFmtKey] = JSON.stringify(val);
	}
	return new rspack.DefinePlugin(featureFlags);
};
