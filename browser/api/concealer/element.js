// Private scope
{
	const escapeAttrs = ["href", "integrity"];

	const escape = {
		get: attr => {
			return (
				attr
					// TODO: Only perform the escapes on the correct element
					.replace($aero.escape(escapeAttrs[0]), "_$&")
					.replace($aero.escape(escapeAttrs[1]), "_$&")
			);
		},
	};

	const attr = {
		apply(_target, _that, args) {
			const [, name] = args;

			args[0] = escape.get(name);

			return Reflect.apply(...arguments);
		},
	};
	const attrNS = {
		apply(_target, _that, args) {
			const [, name] = args;

			args[1] = escape.get(name);

			return Reflect.apply(...arguments);
		},
	};
	const removeAttr = {
		apply(_target, _that, args) {
			// Remove
			Reflect.apply(...arguments);

			// Remove the backup too
			const [name] = args;
			if (name.includes(escapeAttrs)) args[0] = `_${name}`;

			Reflect.apply(...arguments);
		},
	};
	const removeAttrNS = {
		apply(_target, _that, args) {
			// Remove
			Reflect.apply(...arguments);

			// Remove the backup too
			const [, name] = args;
			if (name.includes(escapeAttrs)) args[1] = `_${name}`;

			Reflect.apply(...arguments);
		},
	};

	window.Element.hasAttribute = new Proxy(
		Element.prototype.hasAttribute,
		attr
	);
	window.Element.hasAttribute = new Proxy(
		Element.prototype.hasAttribute,
		attr
	);
	window.Element.hasAttributeNS = new Proxy(
		Element.prototype.hasAttribute,
		attrNS
	);
	window.Element.getAttribute = new Proxy(
		Element.prototype.getAttribute,
		attr
	);
	window.Element.getAttributeNode = new Proxy(
		Element.prototype.getAttributeNode,
		attr
	);
	window.Element.getAttributeNS = new Proxy(
		Element.prototype.getAttribute,
		attrNS
	);
	window.Element.getAttributeNodeNS = new Proxy(
		Element.prototype.getAttribute,
		attrNS
	);
	window.Element.getAttributeNames = new Proxy(
		Element.prototype.getAttributeNames,
		{
			apply(target) {
				return Reflect.apply(...arguments)
					.filter(attr => attr === "_href")
					.map(attr =>
						(target instanceof HTMLAnchorElement &&
							$aero.escape("href").test(attr)) ||
						(target instanceof HTMLScriptElement &&
							$aero.escape("integrity").test(attr))
							? attr.slice(1)
							: attr
					);
			},
		}
	);
	window.Element.prototype.toggleAttribute = new Proxy(
		window.Element.prototype.toggleAttribute,
		removeAttr
	);
	window.Element.prototype.removeAttribute = new Proxy(
		window.Element.prototype.removeAttribute,
		removeAttr
	);
	window.Element.prototype.removeAttributeNS = new Proxy(
		window.Element.prototype.removeAttribute,
		removeAttrNS
	);

	// Conceal
	const concealedAttrs = ["href", "xlink:href", "integrity"];
	function valid(el, attr) {
		return (
			[
				...concealedAttrs,
				...concealedAttrs.filter(attr => `_${attr}`),
			].includes(attr) &&
			// href
			(el instanceof HTMLAnchorElement ||
				el instanceof HTMLAreaElement ||
				// integrity
				el instanceof HTMLScriptElement)
		);
	}
	window.Element = new Proxy(Element, {
		get(target, prop) {
			if (valid(target, prop)) prop = `_${prop}`;

			return Reflect.get(...arguments);
		},
		set(target, prop) {
			if (valid(target, prop)) prop = `_${prop}`;

			return Reflect.set(...arguments);
		},
	});
}
