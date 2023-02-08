navigator.registerProtocolHandler = new Proxy(
	navigator.registerProtocolHandler,
	{
		apply(_target, _that, args) {
			const [, url] = args;

			args[1] = $aero.rewriteSrc(url);

			return Reflect.apply(...arguments);
		},
	}
);

navigator.unregisterProtocolHandler = new Proxy(
	navigator.unregisterProtocolHandler,
	{
		apply(_target, _that, args) {
			const [, url] = args;

			args[1] = $aero.afterPrefix(url);

			return Reflect.apply(...arguments);
		},
	}
);

Navigator.prototype.sendBeacon = new Proxy(Navigator.prototype.sendBeacon, {
	apply(_target, _that, args) {
		const [url] = args;

		args[0] = $aero.rewriteSrc(url);

		return Reflect.apply(...arguments);
	},
});
