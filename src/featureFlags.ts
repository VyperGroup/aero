import type { boolFlagType } from "./AeroSandbox/build/featureFlags";

import { boolFlag } from "./AeroSandbox/build/featureFlags";

export interface FeatureFlags {
	/** @warning currently unsupported */
	FEATURE_URL_ENC: boolFlagType;
	FEATURE_CORS_TESTING: boolFlagType;
	/** @warning currently unsupported */
	FEATURE_CORS_EMULATION: boolFlagType;
	/** @warning currently broken */
	FEATURE_INTEGRITY_EMULATION: boolFlagType;
	/** @warning currently unsupported */
	FEATURE_ENC_BODY_EMULATION: boolFlagType;
	FEATURE_CACHES_EMULATION: boolFlagType;
	FEATURE_CLEAR_EMULATION: boolFlagType;
	REWRITER_HTML: boolFlagType;
	/** @warning currently unsupported */
	REWRITER_XSLT: boolFlagType;
	REWRITER_JS: boolFlagType;
	REWRITER_CACHE_MANIFEST: boolFlagType;
	SUPPORT_LEGACY: boolFlagType;
	/** @warning currently unsupported */
	SUPPORT_WORKER: boolFlagType;
	DEBUG: string;
}

export interface FeatureFlagsRspack extends FeatureFlags {
	/* Defaults to what is in the build config if this is not set */
	SERVER_ONLY: "winterjs" | "cf-workers";
	/* Defaults to what is in the build config if this is not set */
	REQ_INTERCEPTION_CATCH_ALL: "referrer" | "clients";
}

export interface FeatureFlagsRuntime extends FeatureFlags {}

export { boolFlag, boolFlagType };
