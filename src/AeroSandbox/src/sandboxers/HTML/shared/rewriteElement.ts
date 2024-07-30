// TODO: Rewrite each element ... Port this functionality over from the old rewriting code (pre-AeroSandbox)

import * as config from "$src/config";

import rewriteSrc from "$shared/src";
import rewriteHtmlSrc from "./htmlSrc";

import allow from "./csp";
import Cloner from "./Cloner";

import { proxyLocation } from "$shared/proxyLocation";

import block from "$cors/policy";

//https://github.com/VyperGroup/aero/tree/e05df5a523749f93c82f7261d7e7c4aabc6f947c/src/AeroSandbox/src/sandboxers/HTML/custom-elements/mixins
//https://github.com/VyperGroup/aero/blob/298ecc795cd1e7eb844a78543fcfb4d0ae4186bd/src/AeroSandbox/src/sandboxers/HTML/mutation-observers/html.ts

// TODO: Transistion to the new htmlRules system

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
		$aero.config.rewriters.html.type ===
		AeroSandboxTypes.HTMLRewriterType.MutationObserver
	) {
		Object.defineProperty(el, attr, {
			// @ts-ignore
			get: Object.getOwnPropertyDescriptors(elBak).get,
			// @ts-ignore
			set: Object.getOwnPropertyDescriptors(el).set
		});
	}
}

export default function rewriteElement(
	el: Element | Element,
	attr?: string
): Element {
	// Don't exclusively rewrite attributes or check for already observed elements
	const isNew = typeof attr === "undefined";

	// Check if the element's classes are any from the ignore classes
	const elClassList = Array.from(el.classList);
	for (const elClass of elClassList)
		for (const ignoreClass of $aero.config.rewriters.html.ignoreClasses)
			if (elClass === ignoreClass) return el;

	if (
		isNew &&
		el instanceof HTMLScriptElement &&
		!el.hasAttribute("rewritten")
	) {
		if (el.src) {
			if (allow("script-src")) {
				const url = new URL(el.src);

				const isMod = el.type === "module";

				const params = url.searchParams;

				for (const v of params.getAll("isMod")) {
					params.append("_isMod", v);
				}
				params.delete("isMod");
				params.append("isMod", isMod.toString());

				// TODO: Handle integrity in the sw. This would require external libraries to check hashes.
				if (isMod && el.integrity) {
					for (const integrityValue of params.getAll("integrity"))
						url.searchParams.append("_integrity", integrityValue);

					params.set("integrity", el.integrity);
				}

				set(el, "src", url.href);
			} else set(el, "src", "");
		}

		if (
			!el.src &&
			typeof el.innerHTML === "string" &&
			el.innerHTML !== "" &&
			// Ensure the script has a JS type
			(el.type === "" ||
				el.type === "module" ||
				el.type === "text/javascript" ||
				el.type === "application/javascript")
		) {
			// FIXME: Fix safeText so that it could be used here
			el.innerHTML = $aero.js.wrapScript(
				el.innerText,
				el.type === "module"
			);

			// The inline code is read-only, so the element must be cloned
			const cloner = new Cloner(el);

			cloner.clone();
			cloner.cleanup();
		}
	} else if (el instanceof SVGAElement) {
		if (el.href) set(el, "href", rewriteHtmlSrc(el.href.baseVal));
		else if (el.hasAttribute("xlink:href"))
			set(
				el,
				"xlink:href",
				rewriteHtmlSrc(el.getAttribute("xlink:href"))
			);
	} else if (
		el instanceof HTMLAnchorElement ||
		el instanceof HTMLAreaElement ||
		el instanceof HTMLBaseElement
	) {
		if (el.href) {
			set(el, "href", rewriteHtmlSrc(el.href));
		} else if (el.hasAttribute("xlink:href"))
			set(
				el,
				"xlink:href",
				rewriteHtmlSrc(el.getAttribute("xlink:href"))
			);
	} else if (
		el instanceof HTMLFormElement &&
		// Don't rewrite again
		!el._action &&
		// Action is automatically created
		el.action !== null
	)
		set(el, "action", rewriteHtmlSrc(el.action));
	else if (el instanceof HTMLIFrameElement) {
		if (el.src && allow("frame-src")) {
			// Embed the origin as an attribute, so that the frame can reference it to do its checks
			el["parentProxyOrigin"] = proxyLocation().origin;
			set(el, "src");

			// Inject aero imports if applicable then rewrite the Src
			set(el, "src", el.src);
		}
		if (el.srcdoc)
			// Inject aero imports
			set(el, "srcdoc", $aero.init + el.srcdoc);

		// Emulate CSP
		// Delete
		if (el.hasAttribute("csp")) set(el, "csp", "");
		// Emulate
		let sec: {
			csp?: string;
			perms?: string;
			pr?: boolean;
		} = {};
		if (el["csp"]) {
			sec.csp = el["csp"];
			set(el, "csp", "");
		}
		if (el.allow) {
			sec.perms = el.allow;
			set(el, "allow", "");
		}
		if (el["allowPaymentRequest"]) {
			sec.pr = el["allowPaymentRequest"];
			set(el, "allowpaymentrequest", "");
		}
		el.addEventListener(
			"load",
			() => (el.contentWindow["sec"] = JSON.stringify(sec))
		);
	} else if (el instanceof HTMLPortalElement && el["src"])
		set(el, "src", rewriteHtmlSrc(el["src"]));
	else if (el instanceof HTMLImageElement && el.src && !allow("img-src"))
		set(el, "src", "");
	else if (
		el instanceof HTMLAudioElement ||
		(el instanceof HTMLVideoElement && el.autoplay && block("autoplay"))
	)
		set(el, "autoplay");
	else if (el instanceof HTMLMetaElement) {
		switch (el.httpEquiv) {
			case "content-security-policy":
				// TODO: Enforce the CSP instead of deleting it
				set(el, "content", "");
				break;
			case "refresh":
				set(
					el,
					"content",
					el.content.replace(
						/^([0-9]+)(;)(\s+)?(url=)(.*)/g,
						(_match, g1, g2, g3, g4, g5) =>
							g1 +
							g2 +
							g3 +
							g4 +
							rewriteSrc(g5, proxyLocation().href)
					)
				);
		}
	}

	if (isNew && "integrity" in el && el.integrity !== "") {
		// @ts-ignore
		const cloner = new Cloner(el);

		cloner.clone();
		cloner.cleanup();
	}

	if (typeof el.onload === "string")
		set(el, "onload", scope(el.getAttribute("onload")));
	if (typeof el.error === "string")
		set(el, "onerror", scope(el.getAttribute("onload")));
}
