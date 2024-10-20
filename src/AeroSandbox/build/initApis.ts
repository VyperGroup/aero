/*
import type {
	APIInterceptor,
	proxifiedObjType,
	proxifiedObjGeneratorCtxType
} from "../types";
*/

// TODO: Use ToBeDefined
import type {
	default as ToBeDefined, toBeDefinedErrsType
} from "../types/global";

import aeroFeatureConfig from "./customFeatureConfigs/aero";
import isAPIIncluded from "./isApiIncluded";

type level = number;

export default (requiredObjs: {
	// TODO: Define types
	proxyNamespaceObj: any,
	aeroSandboxNamespaceObj: any,
}, logger?, includeRegExp = /\.ts$/): {
	toBeDefinedErrs: toBeDefinedErrsType[],
	toBeDefined: ToBeDefined
} => {
	// Unpack
	// We are assuming the user imports the logger bundle before AeroSandbox
	const { proxyNamespaceObj, aeroSandboxNamespaceObj } = requiredObjs;
	if (!logger) {
		logger = proxyNamespaceObj.logger;
	}

	const proxifiedObjGenCtx: proxifiedObjGeneratorCtxType = {
		...featureConfig.specialInterceptionFeatures
	};

	// TODO: Use types from Rspack
	// @ts-ignore
	const ctx = import.meta.webpackContext("../src/interceptors", {
		regExp: includeRegExp
	});

	const insertLater = new Map<level, proxifiedObjType>();

	const toBeDefinedErrs: toBeDefinedError[];
	const toBeDefined: ToBeDefined;
	for (const fileName of ctx.keys()) {
		try {
			const aI: APIInterceptor = ctx(fileName);
			const apiInterceptorName = aI.globalProp;
			if (isAPIIncluded(apiInterceptorName, aeroFeatureConfig)) continue; // Should skip?
			if (DEBUG)
				logger.log(`Processing API interceptors from the file ${fileName} (${apiInterceptorName})`);
			if (aI.insertLevel && aI.insertLevel !== 0)
				insertLater.set(aI.insertLevel, aI);
			else {
				toBeDefinedErr = handleAI(aI, aeroSandboxNamespaceObj.toBeDefined, proxifiedObjGenCtx);
				toBeDefinedErrs[apiInterceptorName] = toBeDefinedErrs;
			}
		} catch (err) {
			toBeDefinedErrs.push(err);
		}
	}

	const sortedInsertObj = Object.entries(
		Array.from(insertLater.keys()).sort((a, b) => b[1] - a[1])
	) as {
		[key: string]: APIInterceptor;
	};

	for (const aI of Object.values(sortedInsertObj)) handleAI(aI, toBeDefined);

	return {
		toBeDefinedErrs,
		toBeDefined
	}
}

// @ts-ignore
function handleAI(aI: APIInterceptor, toBeDefined: ToBeDefined, proxifiedObjGenCtx: proxifiedObjGeneratorCtxType): toBeDefinedError | "successful" {	// @ts-ignore
	if (aI.proxifiedObj) {
		const proxyObject = resolveProxifiedObj(
			// @ts-ignore
			aI.proxifiedObj,
			proxifiedObjGenCtx
		);

		// TODO: Include more logging in debug mode
		// FIXME: I forgot what this was before
		if (aI.proxifiedObj)
			toBeDefined.self[aI.globalProp] = proxyObject;
		// @ts-ignore
		else if (aI.proxifiedObjWorkerVersion)
			// @ts-ignore
			toBeDefined.proxifiedObjWorkerVersion[aI.globalProp] = aI.proxifiedObjWorkerVersion;
		return "successful";
	}
}

function resolveProxifiedObj(
	// @ts-ignore
	proxifiedObj: proxifiedObjType,
	// @ts-ignore
	ctx: proxifiedObjGeneratorCtxType
	// @ts-ignore
): proxifiedObjType {
	let proxyObject = {};
	if (typeof proxifiedObj === "function") proxyObject = proxifiedObj(ctx);
	else if (typeof proxifiedObj === "object") proxyObject = proxifiedObj;
	return proxyObject;
}