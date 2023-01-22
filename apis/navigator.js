navigator.registerProtocolHandler = new Proxy(
	navigator.registerProtocolHandler,
	{
		apply(target, that, args) {
			[, url] = args;

			args[1] = $aero.rewriteSrc(url);

			return Reflect.apply(...arguments);
		},
	}
);

// Not finished
navigator.unregisterProtocolHandler = new Proxy(
	navigator.unregisterProtocolHandler,
	{
		apply(target, that, args) {
			[, url] = args;

			// TODO: "Unrewrite"
			args[1] = url;

			return Reflect.apply(...arguments);
		},
	}
);

Navigator.prototype.sendBeacon = new Proxy(Navigator.prototype.sendBeacon, {
	apply(target, that, args) {
		[url] = args;

		args[0] = $aero.rewriteSrc(url);

		return Reflect.apply(...arguments);
	},
});
