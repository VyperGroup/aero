import type { htmlRule } from "$aero/types/htmlRules";

const htmlRules = new Map<Element, htmlRule>();

const linkElements = [HTMLAnchorElement, HTMLAreaElement];

// @ts-ignore
for (const linkElement of linkElements)
	htmlRules.set(linkElement, {
		href: "rewrite-html-src"
	});

// TODO: Port the HTML rewriting from rewriteScripts to here and make rewriteScripts use this same htmlRules map

export default htmlRules;
