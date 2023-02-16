onevent = new Proxy(onevent, {
	set() {
		return Reflect.apply(...arguments);
	},
});

self.addEventListener = new Proxy(self.addEventListener, {
	apply(_target, _that, args) {
		const [type, listener] = args;

		// TODO: Intercept

		Reflect.apply(...arguments);
	},
});
