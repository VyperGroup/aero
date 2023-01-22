open = new Proxy(open, {
	apply(target, that, args) {
		[url] = args;

		args[0] = $aero.rewriteSrc(url);

		return Reflect.apply(...arguments);
	},
});
