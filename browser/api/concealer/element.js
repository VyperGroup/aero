// TODO: Only perform the escapes on the correct element
{
	const escape = {
		get: attr => {
			return attr
				.replace($aero.escape("href"), "_$&")
				.replace($aero.escape("integrity"), "_$&");
		},
		set: attr => {
			if (attr === "_href") return "href";
			if (attr === "_integrity") return "integrity";
			return attr;
		},
	};

	window.Element.prototype.getAttribute = new Proxy(
		Element.prototype.getAttribute,
		{
			apply(_target, _that, args) {
				const [attr] = args;

				args[0] = escape.get(attr);

				return Reflect.apply(...arguments);
			},
		}
	);
	window.Element.prototype.removeAttribute = new Proxy(
		Element.prototype.getAttribute,
		{
			apply(_target, _that, args) {
				const [attr] = args;

				args[0] = escape.set(attr);

				return Reflect.apply(...arguments);
			},
		}
	);

	window.Element.prototype.getAttributeNames = new Proxy(
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

	function conceal(attr) {
		Object.defineProperty(window.Element.prototype, attr, {
			get: () => undefined,
		});
	}
	conceal("_href");
	conceal("_integrity");
}
