// TODO: Rewrite each element ... Port this functionality over from the old rewriting code (pre-AeroSandbox)

import * as config from "$aero/config";

import rewriteSrc from "$shared/src";
import rewriteHtmlSrc from "./htmlSrc";
import scope from "$sandbox/JS/scopers/aeroGel";
import rewriteScript from "$sandbox/JS/script";

import checkCsp from "./csp";
import Cloner from "./Cloner";

import { proxyLocation } from "$src/shared/proxyLocation";

import block from "$cors/policy";

// Rules
import * as defaultRules from "./rules";

import { AeroSandboxTypes } from "$types/index";

// @ts-ignore
const rulesArr: any = Object.values(defaultRules).map(rule => [...rule]);
// What the rules for what we need to proxy in the scope of this module
const defaultRulesCollection: Map<any, AeroSandboxTypes.Rule[]> = new Map(
	rulesArr
);

//https://github.com/VyperGroup/aero/tree/e05df5a523749f93c82f7261d7e7c4aabc6f947c/src/AeroSandbox/src/sandboxers/HTML/custom-elements/mixins
//https://github.com/VyperGroup/aero/blob/298ecc795cd1e7eb844a78543fcfb4d0ae4186bd/src/AeroSandbox/src/sandboxers/HTML/mutation-observers/html.ts

const afterRewrote = new WeakMap<HTMLElement, boolean>();
const elContainer = new WeakMap<HTMLElement, HTMLElement>();

function set(el: HTMLElement, attr: string, val = "", backup = true): void {
	// Avoid rewriting the next time by marking it to not be rewrote
	if (afterRewrote.has(el)) {
		const isAfterRewrote = afterRewrote.get(el);
		if (isAfterRewrote === true) {
			afterRewrote.set(el, false);
			return;
		}
	}
	afterRewrote.set(el, true);

	const elBak = el.cloneNode(true);
	if (elBak instanceof HTMLElement) {
		el.setAttribute(attr, val);

		// Backup element (for Element hooks)
		if (backup) elContainer.set(el, elBak);
	}

	// Even though DOMParser affects the DOM too there is no need to mark the element, since the changes aren't going to apply because this happens before the API interceptors are in play.
	if (
		$aero.rewriters.type ===
		AeroSandboxTypes.HTMLRewriterType.MutationObserver
	) {
		Object.defineProperty(el, attr, {
			// @ts-ignore
			get: Object.getOwnPropertyDescriptors(elBak).get,
			// @ts-ignore
			set: Object.getOwnPropertyDescriptors(el).set,
		});
	}
}
