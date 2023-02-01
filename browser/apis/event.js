EventSource = new Proxy(EventSource, {
	construct(target, args) {
		const ret = Reflect.construct(...arguments);

		ret.url = () => $aero.afterPrefix(ret.url);
	},
});
