// TODO: For all of the rules in this file add rewriter and emulation rules, if they exist

import { AeroSandboxTypes } from "$types/index";

// href
const hrefRules = new Map<any, AeroSandboxTypes.EscapeRule[]>();

hrefRules.set(HTMLAnchorElement, {
  attr: "href",
});
hrefRules.set(HTMLAreaElement, {
  attr: "href",
});
// TODO: Support xlink:href attributes - https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:href
// TODO: ...(support the rest of the elements)

// src

// TODO: ...(implement)

// element class, escape rules
const integrityEscapeRules = new Map<
  HTMLElement,
  AeroSandboxTypes.EscapeRule[]
>();

integrityEscapeRules.set(HTMLScriptElement, [
  {
    attr: "integrity",
  },
]);
integrityEscapeRules.set(HTMLLinkElement, [
  {
    attr: "integrity",
    mustContain: ["stylesheet, preload", "modulepreload"],
  },
]);

export default {
  integrityEscapeRules,
};
