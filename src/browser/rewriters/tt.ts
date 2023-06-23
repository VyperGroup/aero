import { flags } from "config";

declare var trustedTypes;

// For Cors Emulation
const tt = trustedTypes.createPolicy("$aero", {
	createHTML: str => str,
	createScript: str => str,
});

// A safe wrapper for text to comply with trusted types
const safeText = (el: HTMLElement, str: string) => {
	const isScript = el instanceof HTMLScriptElement;

	el.innerHTML = flags.corsEmulation
		? tt[isScript ? "createHTML" : "createScript"](str)
		: str;
};

export { tt, safeText };
