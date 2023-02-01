open = new Proxy(open, {
	apply(target, that, args) {
		[url] = args;

		args[0] = $aero.rewriteSrc($aero.config.prefix, url);

		return Reflect.apply(...arguments);
	},
});
