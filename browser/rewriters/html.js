$aero.set = (el, attr, val = "", backup = true) => {
	// Backup element (for element hooks)
	if (backup) el.setAttribute(`_${attr}`, el.getAttribute(attr));

	el.setAttribute(attr, val);
};

/**
 * Rewrite an element
 * @param {Element} - The element to rewrite
 * @param {String=} - If it is an attribute that is being rewritten
 */
$aero.rewrite = async (el, attr) => {
	// Don't exclusively rewrite attributes or check for already observed elements
	const isNew = typeof attr === "undefined";

	if (isNew && typeof el.observed !== "undefined") return;

	const tag = el.tagName.toLowerCase();

	// CSP Testing
	function allow(dir) {
		if (!$aero.config.flags.corsEmulation && $aero.checkCsp(dir)) {
			el.remove();
			return false;
		}

		return true;
	}

	if (isNew && tag === "script" && !el.rewritten) {
		if (el.src) {
			if ($aero.config.bypass.networkInjects) {
				// Prevent LS Proxy injects
				let lsURL = new URL(location.origin);
				lsURL.pathname =
					"/522675c8e566c8eeb53a06be383e5a78f4460bd5d3e6f5b56e9c6ba2413722e5/inject.js";
				if (el.src === lsURL.href) {
					if ($aero.config.bypass.emulate) {
						// TODO: Instead of deleting it, rather create a new script to emulate functionality, to not cause suspicion
					} else {
						$aero.Cloner.deleteScript(el);
					}
					return;
				}

				if ($aero.config.bypass.av)
					try {
						if (
							new URL(el.src).hostname ===
							"me.kis.v2.scr.kaspersky-labs.com"
						) {
							$aero.Cloner.deleteScript(el);
							return;
						}
					} finally {
					}
			}

			if (allow("script-src")) {
				let url = new URL(el.src);

				const isMod = el.type === "module";

				const params = url.searchParams;

				params.getAll("isMod").forEach(v => {
					params.append("_isMod", v);
				});
				params.delete("isMod");
				params.append("isMod", isMod);

				if (isMod && el.integrity) {
					params
						.getAll("integrity")
						.forEach(v => url.searchParams.append("_integrity", v));

					params.set("integrity", el.integrity);
				}

				$aero.set(el, "src", url.href);
			} else $aero.set(el, "src", "");
		}

		if (
			!el.src &&
			!el.classList.contains($aero.config.ignoreClass) &&
			typeof el.innerHTML === "string" &&
			el.innerHTML !== "" &&
			// Ensure the script has a JS type
			(el.type === "" ||
				el.type === "text/javascript" ||
				el.type === "application/javascript")
		) {
			// FIXME: Fix safeText so that it could be used here
			el.innerHTML = $aero.rewriteScript(
				el.innerText,
				el.type === "module"
			);

			// The inline code is read-only, so the element must be cloned
			const cloner = new $aero.Cloner(el);

			cloner.clone();
			cloner.cleanup();
		}
	} else if (el instanceof SVGAElement) {
		if (el.href)
			$aero.set(el, "href", $aero.rewriteHtmlSrc(el.href.baseVal));
		else if (el.hasAttribute("xlink:href"))
			$aero.set(
				el,
				"xlink:href",
				$aero.rewriteHtmlSrc(el.getAttribute("xlink:href").href)
			);
	} else if (tag === "a" || tag === "area" || tag === "base") {
		if (el.href) {
			$aero.set(el, "href", $aero.rewriteHtmlSrc(el.href));
		} else if (el.hasAttribute("xlink:href"))
			$aero.set(
				el,
				"xlink:href",
				$aero.rewriteHtmlSrc(el.getAttribute("xlink:href"))
			);
	} else if (
		tag === "form" &&
		// Don't rewrite again
		!el._action &&
		// Action is automatically created
		el.action !== null
	)
		$aero.set(el, "action", $aero.rewriteHtmlSrc(el.action));
	else if (tag === "iframe") {
		// TODO: Enforce the CSP instead of deleting it
		if (el.csp) $aero.set(el, "csp", "");

		if (el.src && allow("frame-src")) {
			// Embed the origin as an attribute, so that the frame can reference it to do its checks
			el.parentProxyOrigin = $aero.proxyLocation.origin;
			$aero.set(el, "src");

			// Inject aero imports if applicable then rewrite the Src
			$aero.set(el, "src", el.src);
		}
		if (el.srcdoc)
			// Inject aero imports
			$aero.set(el, "srcdoc", $aero.init + el.srcdoc);

		// Emulate CSP
		const sec = {};
		if (el.csp) {
			sec.csp = el.csp;
			$aero.set(el, "csp", "");
		}
		if (el.allow) {
			sec.perms = el.allow;
			$aero.set(el, "allow", "");
		}
		if (el.allowpaymentrequest) {
			sec.pr = el.allowpaymentrequest;
			$aero.set(el, "allowpaymentrequest", "");
		}
		el.addEventListener(
			"load",
			() => (el.contentWindow.sec = JSON.stringify(sec))
		);
	} else if (tag === "portal" && el.src)
		$el.set(el, "src", $aero.rewriteHtmlSrc(el.src));
	else if (tag === "img" && el.src && !allow("img-src"))
		$aero.set(el, "src", "");
	else if (
		tag === "audio" ||
		(tag === "video" && el.autoplay && $aero.blockPerm("autoplay"))
	)
		$aero.set(el, "autoplay");
	else if (tag === "meta") {
		switch (el.httpEquiv) {
			case "content-security-policy":
				// TODO: Enforce the CSP instead of deleting it
				$aero.set(el, "content", "");
				break;
			case "refresh":
				$aero.set(
					el,
					"content",
					el.content.replace(
						/^([0-9]+)(;)(\s+)?(url=)(.*)/g,
						(_match, g1, g2, g3, g4, g5) =>
							g1 + g2 + g3 + g4 + $aero.rewriteSrc(g5)
					)
				);
		}
	} else if (tag === "link" && tag.rel === "manifest") {
		$aero.set(el, "href", $aero.rewriteSrc(el.href));
	} else if ($aero.config.flags.legacy && tag === "html") {
		// Cache manifests
		$aero.set(el, "manifest", $aero.rewriteSrc(el.manifest));
	}

	if (isNew && "integrity" in el && el.integrity !== "") {
		const cloner = new $aero.Cloner(el);

		cloner.clone();
		cloner.cleanup();
	}

	if (typeof el.onload === "string")
		$aero.set(el, "onload", $aero.scope(el.getAttribute("onload")));
	if (typeof el.error === "string")
		$aero.set(el, "onerror", $aero.scope(el.getAttribute("onload")));

	el.observed = true;
};
