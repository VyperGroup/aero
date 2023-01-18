$aero.set = (el, attr, val) => {
	// Backup element
	// For Element hooks
	el[`_${attr}`] = val;
	el[attr] = val;
};

/**
 * Rewrite an element
 * @param {Element} - element The event to rewrite
 */
$aero.rewrite = el => {
	if (typeof el.observed !== "undefined") return;

	const tag = el.tagName.toLowerCase();

	if (
		tag === "script" &&
		!el.rewritten &&
		typeof el.innerHTML === "string" &&
		el.innerHTML !== ""
	) {
		$aero.set(el, el.innerHTML, $aero.safeText($aero.scope(el.innerText)));

		// The inline code is read-only, so the element must be cloned
		const cloner = new $aero.Cloner(el);

		cloner.clone();
		cloner.cleanup();
	} else if (tag === "a" && el.href)
		$aero.set(el, "href", $aero.rewriteHtmlSrc(el.href));
	else if (
		tag === "form" &&
		// Don't rewrite again
		!el._action &&
		// Action is automatically created
		el.action !== null
	)
		$aero.set(el, "action", $aero.rewriteHtmlSrc(action));
	else if (tag === "iframe") {
		if (el.csp) $aero.set(el, "csp", rewriteCSP(el.csp));

		/*
		There is an edge-case that I need to fix, where it is possible that the site is requesting a resource from the proxy site itself and seeing if it would be rewritten 
		This is rare, as it would require the site to know the proxy url in the first place, but is a real concern
		*/
		if (el.src)
			// Inject aero imports if applicable then rewrite the Src
			$aero.set(
				el,
				"src",
				$aero.rewriteHtmlSrc(
					src.replace(/data:text\/html/g, "$&" + $aero.imports)
				)
			);
		if (el.srcdoc)
			// Inject aero imports
			$aero.set(el, "srcdoc", $aero.imports + el.srcdoc);
	} else if (tag === "meta") {
		switch (el.httpEquiv) {
			case "content-security-policy":
				$aero.set(el, "content", $aero.rewriteCSP(el.content));
			case "refresh":
				$aero.set(
					el,
					"content",
					el.content.replace(
						/^([0-9]+)(;)(\s+)?(url=)(.*)/g,
						(match, g1, g2, g3, g4, g5) =>
							g1 + g2 + g3 + g4 + $aero.rewriteSrc(g5)
					)
				);
		}
	}

	if ("integrity" in el && el.integrity !== "") {
		const cloner = new $aero.Cloner(el);

		cloner.clone();
		cloner.cleanup();
	}

	el.observed = true;
};
