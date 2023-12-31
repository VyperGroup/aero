import proxy from "$aero/shared/autoProxy/autoProxy";

import escape from "$aero_browser/misc/escape";

// Private scope
{
	const escapeAttrs = ["href", "integrity"];

	const escapeEl = {
		get: attr => {
			return (
				attr
					// TODO: Only perform the escapes on the correct element
					.replace(escape(escapeAttrs[0]), "_$&")
					.replace(escape(escapeAttrs[1]), "_$&")
			);
		},
	};

	const attr = {
		apply(target, that, args) {
			const [, name] = args;

			args[0] = escapeEl.get(name);

			return Reflect.apply(target, that, args);
		},
	};
	const attrNS = {
		apply(target, that, args) {
			const [, name] = args;

			args[1] = escapeEl.get(name);

			return Reflect.apply(target, that, args);
		},
	};
	const removeAttr = {
		apply(target, that, args) {
			// Remove
			Reflect.apply(target, that, args);

			// Remove the backup too
			const [name] = args;
			if (name.includes(escapeAttrs)) args[0] = `_${name}`;

			Reflect.apply(target, that, args);
		},
	};
	const removeAttrNS = {
		apply(target, that, args) {
			// Remove
			Reflect.apply(target, that, args);

			// Remove the backup too
			const [, name] = args;
			if (name.includes(escapeAttrs)) args[1] = `_${name}`;

			Reflect.apply(target, that, args);
		},
	};

	Element.prototype.hasAttribute = new Proxy(
		Element.prototype.hasAttribute,
		attr,
	);
	Element.prototype.hasAttribute = new Proxy(
		Element.prototype.hasAttribute,
		attr,
	);
	Element.prototype.hasAttributeNS = new Proxy(
		Element.prototype.hasAttribute,
		attrNS,
	);
	Element.prototype.getAttribute = new Proxy(
		Element.prototype.getAttribute,
		attr,
	);
	Element.prototype.getAttributeNode = new Proxy(
		Element.prototype.getAttributeNode,
		attr,
	);
	Element.prototype.getAttributeNS = new Proxy(
		Element.prototype.getAttribute,
		attrNS,
	);
	Element.prototype.getAttributeNodeNS = new Proxy(
		Element.prototype.getAttribute,
		attrNS,
	);
	Element.prototype.getAttributeNames = new Proxy(
		Element.prototype.getAttributeNames,
		{
			apply(target, that, args) {
				return Reflect.apply(target, that, args)
					.filter(attr => attr === "_href")
					.map(attr =>
						(target instanceof HTMLAnchorElement &&
							escape("href").test(attr)) ||
						(target instanceof HTMLScriptElement &&
							escape("integrity").test(attr))
							? attr.slice(1)
							: attr,
					);
			},
		},
	);
	Element.prototype.toggleAttribute = new Proxy(
		Element.prototype.toggleAttribute,
		removeAttr,
	);
	Element.prototype.removeAttribute = new Proxy(
		Element.prototype.removeAttribute,
		removeAttr,
	);
	Element.prototype.removeAttributeNS = new Proxy(
		Element.prototype.removeAttribute,
		removeAttrNS,
	);

	// Conceal
	/*
	const concealedAttrs = ["href", "xlink:href", "integrity"];
	function invalid(el, attr) {
		return !(
			([
				...concealedAttrs,
				...concealedAttrs.filter(attr => `_${attr}`),
			].includes(attr) &&
				// href
				(el instanceof HTMLAnchorElement ||
					el instanceof HTMLAreaElement ||
					// integrity
					el instanceof HTMLScriptElement)) ||
			(el instanceof HTMLIFrameElement && attr === "parentProxyOrigin") ||
			attr === onload
		);
	}
	// TODO: Fix
	Element = new Proxy(Element, {
		get(target, prop) {
			if (invalid(target, prop)) prop = `_${prop}`;

			return Reflect.get(target, prop);
		},
		set(target, prop) {
			if (invalid(target, prop)) prop = `_${prop}`;

			return Reflect.set(target, prop, value);
		},
	});
	*/
}
