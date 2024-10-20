import type { AeroSandboxFeaturesConfig } from "./types/aeroSandbox";

import rspack from "@rspack/core";

const snakeCaseMatch = /([a-z])([A-Z])/g;
const replacementSnakeCaseToUnderscoreCase = "$1_$2";

export default (config: AeroSandboxFeaturesConfig) => {
	const featureFlags: { [key: string]: string } = {};
	for (const [key, val] of Object.entries(config)) {
		const camelCaseToFeatureFlagFmtKey = key
			.replaceAll(snakeCaseMatch, replacementSnakeCaseToUnderscoreCase)
			.toUpperCase();
		featureFlags[camelCaseToFeatureFlagFmtKey] = JSON.stringify(val);
	}
	Object.freeze(featureFlags);
	return new rspack.DefinePlugin(featureFlags);
};
