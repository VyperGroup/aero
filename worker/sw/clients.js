// TODO: Finish all the properties

Clients.get = new Proxy(Clients.get, {
	apply() {
		let ret = Reflect.target(...arguments);

		ret.url = ret.url.match(
			new RegExp(`^(${$aero.config.prefix})/*`, "g")
		)[0];

		return ret;
	},
});
