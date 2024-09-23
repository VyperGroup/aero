import type {
	AeroGelConfig,
	aerogelParser,
	keywordReplacementType
} from "../../../../types/aeroSandbox";

//import esniff from "esniff";

// Webpack Feature Flags
var INCLUDE_ESNIFF: boolean;

// TODO: Setup test cases
export default class AeroGel {
	config: AeroGelConfig;
	constructor(config: AeroGelConfig) {
		this.config = config;
	}
	applyNewConfig(config: AeroGelConfig) {
		this.config = config;
	}
	static supportedParsers(): aerogelParser[] {
		const supports: aerogelParser[] = [];
		if (INCLUDE_ESNIFF) supports.push("esniff");
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
				window: ${this.config.objPaths.proxy.window},
				globalThis: ${this.config.objPaths.proxy.window},
				location: ${this.config.objPaths.proxy.location}
		 	 });
		`;
	}
	/** This method is specifically for `var keyword rewriting` */
	rewriteScript(script: string): string {
		/*
		if (INCLUDE_ESNIFF) {
			let letIndicies = [];
			let constIndicies = [];
			// @ts-ignore
			esniff(script, (emitter: any) => {
				// @ts-ignore
				emitter.on("trigger:let", (accessor: any) => {
					if (accessor.scopeDepth === 0)
						letIndicies.push(accessor.index);
				});
				emitter.on("trigger:const", (accessor: any) => {
					if (accessor.scopeDepth === 0)
						constIndicies.push(accessor.index);
				});
			});
			let keywordReplacements: keywordReplacementType = {};
			letIndicies.forEach(index => {
				keywordReplacements[index] = {
					keywordLen: 3,
					replacementStr: this.config.objPaths.fakeVars.let,
				};
			});
			constIndicies.forEach(index => {
				keywordReplacements[index] = {
					keywordLen: 5,
					replacementStr: this.config.objPaths.fakeVars.const,
				};
			});
			script = this.replaceKeywords(script, keywordReplacements);
		}
		*/
		return script;
	}
	replaceKeywords(
		str: string,
		keywordReplacements: keywordReplacementType
	): string {
		const charArr = Array.from(str);
		let totalAddedToIndex = 0;
		for (const [indexStr, replacementData] of Object.entries(
			keywordReplacements
		)) {
			const { keywordLen, replacementStr } = replacementData;
			const index = Number.parseInt(indexStr);
			const replacementArr = Array.from(replacementStr);
			totalAddedToIndex += replacementArr.length - keywordLen;
			charArr.splice(
				index + totalAddedToIndex,
				keywordLen,
				replacementStr
			);
		}
		return charArr.join("");
	}
}
