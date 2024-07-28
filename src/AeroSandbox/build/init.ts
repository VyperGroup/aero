import {
	APIInterceptor,
	proxifiedObjType,
	proxifiedObjGeneratorContext
} from "../types";

import { htmlRewriterMode } from "../types/rewriters/html";

import { buildConfig } from "./customBuilds/aero";
import { buildConfig as buildConfigFrakenUV } from "./customBuilds/frankenUV.inject.ts";

import { config } from "../src/config.ts";
import { FeatureFlags } from "./featureFlags";

declare const HTML_REWRITER_MODE: htmlRewriterMode;

let proxifiedObjGenCtx: proxifiedObjGeneratorContext = {
	...buildConfig.specialInterceptionFeatures
};

if (process.env.BUILD_UV_FRAKEN)
	proxifiedObjGenCtx = {
		...buildConfigFrakenUV.specialInterceptionFeatures
	};

if (process.env.BUILD_WOMBAT_SHIM) {
	// TODO: Build
}

type level = number;
const insertLater = new Map<level, proxifiedObjType>();

// @ts-ignore TODO: Move this code to AeroSandbox
const ctx = import.meta.webpackContext("../src/interceptors", {
	include: /\.ts$/
});
for (const fileName of ctx.keys()) {
	console.log(fileName);
	const aI: APIInterceptor = ctx(fileName);
	if (aI.insertLevel && aI.insertLevel !== 0)
		insertLater.set(aI.insertLevel, aI);
	else handleAI(aI);
}

// @ts-ignore
const sortedInsertObj = Object.entries(
	Array.from(insertLater.keys()).sort((a, b) => b[1] - a[1])
) as {
	[key: string]: APIInterceptor;
};

for (const aI of Object.values(sortedInsertObj)) {
	handleAI(aI);
}

function handleAI(aI: APIInterceptor): void {
	if (aI.exposedContexts) {
		if (Object.values(aI.exposedContexts).includes("window")) {
			// @ts-ignore
			if (aI.proxifiedObj) {
				let proxyObject = resolveProxifiedObj(
					// @ts-ignore
					aI.proxifiedObj,
					proxifiedObjGenCtx
				);

				window[aI.globalProp] = proxyObject;
			} // @ts-ignore
			else if (aI.proxifiedObjWorkerVersion) {
				Object.defineProperty(
					window,
					aI.globalProp,
					aI.proxifiedObjWorkerVersion
				);
			}
		}
	} else {
		// @ts-ignore
		if (aI.proxifiedObj) {
			let proxyObject = resolveProxifiedObj(
				// @ts-ignore
				aI.proxifiedObj,
				proxifiedObjGenCtx
			);

			self[aI.globalProp] = proxyObject;
		} // @ts-ignore
		else if (aI.proxifiedObjWorkerVersion) {
			Object.defineProperty(
				self,
				aI.globalProp,
				aI.proxifiedObjWorkerVersion
			);
		}
	}
}

function resolveProxifiedObj(
	proxifiedObj: proxifiedObjType,
	ctx: proxifiedObjGeneratorContext
): proxifiedObjType {
	let proxyObject = {};
	if (typeof proxifiedObj === "function") proxyObject = proxifiedObj(ctx);
	else if (typeof proxifiedObj === "object") proxyObject = proxifiedObj;
	return proxyObject;
}

// Run the HTML Interceptors as per the config
const supportedHTMLRewriterModes: string[] = JSON.parse(
	// @ts-ignore
	SUPPORTED_HTML_REWRITER_MODES
);

const preferredMode = config.FeatureFlags.HTML_REWRITER_MODE;
if (!supportedHTMLRewriterModes.includes(preferredMode)) {
	throw new Error(
		`This build of AeroSandbox does not support ${preferredMode}`
	);
}

if (preferredMode === "mutation_observer")
	import("../src/sandboxers/HTML/adaptors/useMutationObservers.ts");
if (preferredMode === "custom_elements")
	throw new Error("Unsupported rewriter mode!");
if (preferredMode === "domparser")
	import("../src/sandboxers/HTML/adaptors/useDOMParser.ts");
if (preferredMode === "sw_parser")
	import("../src/sandboxers/HTML/adaptors/useParser.ts");
