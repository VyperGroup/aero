/**
 * Rewrite an element
 * @param {Element} - element The event to rewrite
 */
$aero.rewrite = el => {
	if (typeof el.observed !== "undefined") return;

	const tag = el.tagName.toLowerCase();

	if (tag === "script") {
		const rewrite = typeof el.innerHTML === "string" && !el.rewritten;

		if (rewrite) {
			const hasContent = el.innerHTML !== "";

			if (hasContent) {
				el.innerHTML = $aero.setText($aero.scope(el.innerText));

				// The inline code is read-only, so the element must be cloned
				const cloner = new $aero.Cloner(el);

				cloner.clone();
				cloner.cleanup();
			}
		}
	} else if (tag === "a" && el.href) {
		// Backup
		const href = el.getAttribute("href");

		el._href = href;

		el.setAttribute("href", $aero.rewriteSrc(href));
	} else if (tag === "form" && /*Don't rewrite again*/ !el._action) {
		const action = el.getAttribute("action");

		// In form elements actions are automatically created, instead so check if it is null
		const actionExists = action !== null;

		if (actionExists) {
			// Backup
			el._action = action;

			el.setAttribute("action", $aero.rewriteSrc(action));
		}
	} else if (tag === "iframe") {
		const srcExists = el.src != null && el.src != "";

		if (srcExists) {
			const src = el.getAttribute("src");

			el._src = src;

			// Inject aero imports if applicable then rewrite the Src
			el.setAttribute(
				"src",
				$aero.rewriteSrc(
					src.replace(/data:text\/html/g, "$&" + $aero.imports)
				)
			);

			if (el.srcdoc)
				// Inject aero imports
				el.srcdoc = $aero.imports += el.srcdoc;
		}
	} else if (tag === "meta") {
		switch (el.httpEquiv) {
			case "content-security-policy":
				// Rewrite
				el.content = $aero.config.rewriteCSP
					? $aero.rewriteCSP(el.content)
					: "";
			case "refresh":
				el.content = el.content.replace(
					/[0-9]+;url=(.*)/g,
					`${$aero.config.prefix}/$1`
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
