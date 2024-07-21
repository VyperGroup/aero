import { AeroSandboxConfig } from "$aero/types";

/** Runs as a webpack plugin */
export class AeroSandbox {
	config: AeroSandboxConfig;
	fakeOrigin(
		apiIncludeBitwiseEnum: APIBitwiseEnum | "all",
		apiExcludeBitwiseEnum: APIBitwiseEnum | "none",
		rewriterModesBitwiseEnum: rewriterModesBitwiseEnum,
		isWorker = false,
		proxyOrigin: string
	): ResultAsync<boolean> {
		// TODO: Implement...
	}
	/** This API isn't implemented yet and is here to serve as a placeholder */
	faker: {};
	rewriters;
}
