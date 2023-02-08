// Gets the sources in the CSP with directive
$aero.cspSrc = dir => {
	const [rawSources] = $aero.cors.csp.match(
		new RegExp(`${dir} ([^;]*)`),
		"g"
	);

	if (typeof rawSources === "undefined") return;

	return rawSources.split(" ");
};

// If CSP blocked
$aero.checkCsp = dir => {
	const sources = $aero.cspSrc(dir);

	let blocked = false;

	if (sources) {
		let allowed = false;

		if (!sources.includes("'none'"))
			for (const source of sources) {
				/*
                    TODO: Actually check for proper sources like urls with wildcards
                    This is just a hacky solution for now
                    */
				if ($aero.proxyLocation.contains(source)) allowed = true;
			}

		if (!allowed) blocked = true;
	}

	return blocked;
};
