// For Cors Emulation

// Trusted Types
// To comply with trusted type headers if applicable
$aero.tt = trustedTypes.createPolicy("$aero", {
	createHTML: str => str,
	createScript: str => str,
});

// A safe wrapper for trusted types
$aero.setText = (el, str) => {
	const isScript = el instanceof HTMLScriptElement;

	if ($aero.config.flags.corsEmulation)
		el.innerHTML = $aero.tt[isScript ? "createHTML" : "createScript"](str);
	else el.innerHTML = str;
};
