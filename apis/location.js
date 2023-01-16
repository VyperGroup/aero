// Dynamically update location using a function getters
Object.defineProperty($aero, "proxyLocation", {
	get: () =>
		new URL(
			location.href.match(
				new RegExp(`(?<=${$aero.config.prefix}).*`, "g")
			)[0]
		),
});

// Private scope
(() => {
	// Prevent detection by instanceof
	let inheritedObject = {};
	Reflect.setPrototypeOf(inheritedObject, Location.prototype);

	const wrap = url => $aero.config.prefix + url;

	const locationProxy = new Proxy(inheritedObject, {
		get(target, prop) {
			if (typeof target[prop] === "function") {
				const props = {
					toString: url => $aero.proxyLocation.toString(),
					assign: url => location.assign(wrap(url)),
					replace: (...args) => "",
				};

				return prop in props ? props[prop] : target[prop];
			}

			const fakeUrl = $aero.proxyLocation;

			const customProps = {
				ancestorOrigins: location.ancestorOrigins,
			};

			if (prop in customProps) return customProps[prop];

			if (prop in fakeUrl) return fakeUrl[prop];

			return location[prop];
		},
		set(target, prop, value) {
			if (
				prop === "pathname" ||
				(prop === "href" && value.startsWith("/"))
			)
				return (
					$aero.config.prefix +
					$aero.proxyLocation.origin +
					"/" +
					value
				);

			return value;
		},
	});

	Object.defineProperty($aero, "location", {
		value: locationProxy,
		writeable: false,
	});
})();

$aero.document = {};

Object.defineProperty($aero.document, "domain", {
	get: () => $aero.proxyLocation.hostname,
});

Object.defineProperty($aero.document, "URL", {
	get: () => $aero.proxyLocation.href,
});
