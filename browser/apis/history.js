var historyState = {
	apply(target, that, args) {
		const [state, title, url = ""] = args;

		args[2] = $aero.rewriteSrc($aero.config.prefix, url);
		args[3] = $aero.rewriteSrc($aero.config.prefix, url);

		return Reflect.apply(...arguments);
	},
};

history.pushState = new Proxy(history.pushState, historyState);
history.replaceState = new Proxy(history.replaceState, historyState);
