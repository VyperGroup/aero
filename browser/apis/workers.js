if ($aero.config.nestedWorkers) {
	// This api is only exposed in secure contexts
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register = new Proxy(
			navigator.serviceWorker.register,
			{
				apply(target, that, args) {
					[path, opts] = args;

					args[0] = `${$aero.rewriteSrc(
						$aero.config.prefix,
						path
					)}?mod=${opts.type === "module"}`;

					console.log(
						`Registering a nested service worker\n${path} -> ${args[0]}`
					);

					return Reflect.apply(...arguments);
				},
			}
		);

		const rewriteReg = reg =>
			// Don't let the site see the aero sw
			(reg.active.scriptURL = reg.active.scriptURL.match(
				new RegExp(
					`(?<=${location.origin}${prefix}${$aero.proxyLocation.origin}).*`,
					"g"
				)
			)[0]);

		navigator.serviceWorker.getRegistration = new Proxy(
			navigator.serviceWorker.getRegistration,
			{
				apply: async (target, that, args) =>
					(await target()).map(reg => rewriteReg(reg)),
			}
		);
		navigator.serviceWorker.getRegistrations = new Proxy(
			navigator.serviceWorker.getRegistrations,
			{
				apply: async (target, that, args) => rewriteReg(await target()),
			}
		);
	}

	Worker = new Proxy(Worker, {
		construct(target, args) {
			return Reflect.construct(...arguments);
		},
	});

	SharedWorker = new Proxy(SharedWorker, {
		construct(target, args) {
			return Reflect.construct(...arguments);
		},
	});
}
