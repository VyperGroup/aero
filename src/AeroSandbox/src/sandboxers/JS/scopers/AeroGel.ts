import { AeroGelConfig } from "$aero/types";

// Webpack Feature Flags
var INCLUDE_AEROGEL_MINIMAL: boolean, INCLUDE_ESNIFF: boolean;

export default class AeroGel {
	config: AeroGelConfig;
	constructor(config: AeroGelConfig) {
		this.config = config;
	}
	applyNewConfig(config: AeroGelConfig) {
		this.config = config;
	}
	public supportedParsers() {
		let supports: string[] = [];
		if (INCLUDE_ESNIFF) supports.push("esniff");
		if (INCLUDE_AEROGEL_MINIMAL) supports.push("aerogel_minimal");
		return supports;
	}
	/** This essentially the rewriter
	 * @param script The script to jail. Before it is jailed the let/const to fake vars RegExp rewriting occurs.
	 * @param isModule Module scripts don't need to be rewritten because they don't require fake vars for scope emulation since module scripts run in their own isolated scope.
	 * @example TODO: Provide an example
	 */
	jailScript(script: string, isModule: boolean) {
		return /* js */ `
			!() => {
				${isModule ? script : this.rewriteScript(script)}
		  	}().call({
				window: ${this.config.proxyObjPaths.window},
				globalThis: ${this.config.proxyObjPaths.window},
				location: ${this.config.proxyObjPaths.location}
		 	 });
		`;
	}
	/** This method is specifically for `var keyword rewriting` */
	rewriteScript(script: string): string {
		if (INCLUDE_AEROGEL_MINIMAL) {
			// TODO: Implement
			$aero.logger.fatalErr(
				"AeroGel minimal is unsupported at the moment!"
			);
		}
		if (INCLUDE_ESNIFF) {
			// TODO: Implement
			$aero.logger.fatalErr("Esniff is unsupported at the moment!");
		}
		return script;
	}
}
