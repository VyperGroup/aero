import type { FeatureFlagsRspack } from "./types/featureFlags";

export default ctx =>
	// @ts-ignore
	({
		featureUrlEnc: false,
		featureCorsTesting: false,
		featureCorsEmulationn: false,
		FEATURE_INTEGRITY_EMULATION: false,
		featureEncBodyEmulation: false,
		featureCachesEmulation: false,
		featureClearEmulation: false,
		rewriterHtml: true,
		rewriterXslt: false,
		rewriterJs: false,
		rewriterCacheManifest: false,
		supportLegacy: false,
		supportWorker: false,
		// Branding
		aeroBrandingInProd: true,
		// Feel free to change this default if you are making a fork of aero
		githubRepo: "https://github.com/vortexdeveloperlabs/aero",
		// Debug
		debug: JSON.stringify(ctx.debugMode)
	}) as FeatureFlagsRspack;
