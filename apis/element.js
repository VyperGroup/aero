// To hide href and integrity changes
function setElementPrototype(name) {
	const interface = window[`HTML${name}Element`];
	interface.prototype = new Proxy(interface.prototype, {
		get: (target, prop) => (prop === "href" ? target._href : target[prop]),
	});
}

setElementPrototype("Anchor");
