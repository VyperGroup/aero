var historyState = {
	apply(target, that, args) {
		let [state, title, url = ""] = args;

		args[2] = $aero.rewriteSrc(url);
		args[3] = $aero.rewriteSrc(url);

		return Reflect.apply(...arguments);
	},
};

history.pushState = new Proxy(history.pushState, historyState);
history.replaceState = new Proxy(history.replaceState, historyState);
