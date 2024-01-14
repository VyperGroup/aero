// TODO: For all of the rules in this file add rewriter and emulation rules, if they exist

// href
const hrefRules = new Map<any, AeroSandboxTypes.Rule[]>();

hrefRules.set(HTMLAreaElement, {
	attr: "href",
});
// TODO: ...(finish the rest of the elements)

// src

// TODO: ...(implement)

// element class, escape rules
const integrityEscapeRules = new Map<any, AeroSandboxTypes.Rule[]>();

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
