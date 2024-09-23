import type { AeroSandboxConfig } from "../types/aeroSandbox";

export default class AeroSandbox {
	config: AeroSandboxConfig;
	fakeOrigin(
		apiIncludeBitwiseEnum: APIBitwiseEnum | "all",
		apiExcludeBitwiseEnum: APIBitwiseEnum | "none",
		rewriterModesBitwiseEnum: rewriterModesBitwiseEnum,
		isWorker = false,
		proxyOrigin: string
	): ResultAsync<boolean> {}
	/** This API isn't implemented yet and is here to serve as a placeholder */
	faker: {};
	rewriters;
}
