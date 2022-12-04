open = new Proxy(open, {
	apply(target, that, args) {
		[url] = args;

		if (url)
			if (url.startsWith("/"))
				args[0] =
					$aero.config.prefix + $aero.proxyLocation.origin + url;
			else args[0] = $aero.config.prefix + url;

		return Reflect.apply(...arguments);
	},
});
