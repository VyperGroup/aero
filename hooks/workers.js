if ($aero.config.nestedWorkers) {
	// This api is only exposed in secure contexts
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register = new Proxy(
			navigator.serviceWorker.register,
			{
				apply(target, that, args) {
					console.log("Registering a nested service worker");

					console.log(args);

					return Reflect.apply(...arguments);
				},
			}
		);

		const rewriteReg = reg =>
			reg.map(
				reg =>
					(reg.active.scriptURL = reg.active.scriptURL.match(
						new RegExp(
							`(?<=${$aero.proxyLocation.hostname}).*`,
							"g"
						)
					)[0])
			);

		navigator.serviceWorker.getRegistration = new Proxy(
			navigator.serviceWorker.getRegistration,
			{
				async apply(target, that, args) {
					const reg = await target();

					reg.active.scriptUrl === "/sw.js"
						? undefined
						: rewriteReg(reg);
				},
			}
		);
		navigator.serviceWorker.getRegistrations = new Proxy(
			navigator.serviceWorker.getRegistrations,
			{
				async apply(target, that, args) {
					return rewriteReg(await target());
				},
			}
		);
	}

	Worker = new Proxy(Worker, {
		construct(target, args) {
			return Reflect.construct(target, args);
		},
	});
}
