// TODO: This will be the runtime version of AeroSandbox

import type { toBeDefinedErrsType } from "../types/global";
import type { ResultAsync, ok, err } from "neverthrow";

import getPropFromTree from "../src/util/getPropFromTree";

import type { Config } from "../types/config.d.ts";

import initApis from "./initApis";

export default class AeroSandboxRuntime {
	// TODO: Import the types for these from aero
	proxyNamespaceObj: any;
	aeroSandboxNamespaceObj: any;
	configObj: any;
	// TODO: Remove AeroSandboxBuildConfig
	constructor(config: Config) {
		/** This would be `$aero` */
		// @ts-ignore
		this.proxyNamespaceObj = getPropFromTree(PROXY_NAMESPACE);
		// @ts-ignore
		proxyNamespaceObj[OUR_NAMESPACE] = { config };
		/** This would be `$aero.sandbox` */
		// @ts-ignore
		this.aeroSandboxNamespaceObj = this.proxyNamespaceObj[OUR_NAMESPACE];
		// @ts-ignore
		aeroSandboxNamespaceObj[toBeDefined] = {};
		// @ts-ignore
		this.configObj = aeroSandboxNamespaceObj[CONFIG_KEY];
	}
	// @ts-ignore
	initAPIs(): ResultAsync<
		// You control the APIs from other methods on this class
		void,
		toBeDefinedErrsType
	> {
		const { toBeDefinedErrs, toBeDefined } = initApis({
			proxyNamespaceObj: this.proxyNamespaceObj,
			aeroSandboxNamespaceObj: this.aeroSandboxNamespaceObj,
			featureConfig: this.configObj.featureConfig
		});

		for (const [globalProp, proxyObject] of Object.entries(
			toBeDefined.window
		))
			if (isAPIIncluded(globalProp)) window[globalProp] = proxyObject;
		for (const [globalProp, proxifiedObjWorkerVersion] of Object.entries(
			toBeDefined.proxifiedObjWorkerVersion
		))
			if (isAPIIncluded(globalProp))
				Object.defineProperty(
					window,
					globalProp,
					proxifiedObjWorkerVersion
				);

		return toBeDefinedErrs.length > 0 ? err(toBeDefinedErrs) : ok();
	}
	fakeOrigin(
		proxyOrigin?: string
		// TODO: isWorker = false,
		// TODO: Import from Neverthrow
	): void {
		if (proxyOrigin) this.configObj.proxyOrigin = proxyOrigin; // TODO: Make functionality for this config option
		// When this is unset it will proceed with using the prefix to get the URL for the fake origin
	}
	/** This API isn't implemented yet and is here to serve as a placeholder */
	faker: {};
	// TODO: Import the Rewriters from aero
	rewriters;
	// Internal methods
	isAPIIncluded(apiName: string): boolean {
		// TODO: Look at configObj.featureConfig and see if it matches
		return true;
	}
}
