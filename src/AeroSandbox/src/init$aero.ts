import BareClient from "@mercuryworkshop/bare-mux";

import { AeroGlobalType } from "$types/$aero.d";

// Sanity check
if (!("$aero" in window)) {
	const err = "Unable to initalize $aero";
	console.error(err);
	document.write(err);
}

$aero.bc = new BareClient();

// Protect from overwriting, in case $aero scoping failed
Object.freeze($aero);
