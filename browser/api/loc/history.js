var historyState = {
	apply(_target, _that, args) {
		const [, , url = ""] = args;

		// FIXME: Breaks on https://search.brave.com
		// FIXME: Reaches maximum call stack size on https://beinternetawesome.withgoogle.com/en_us/interland/
		console.log(url);
		console.log(args);

		args[2] = $aero.rewriteSrc(url);
		args[3] = $aero.rewriteSrc(url);

		return Reflect.apply(...arguments);
	},
};

history.pushState = new Proxy(history.pushState, historyState);
history.replaceState = new Proxy(history.replaceState, historyState);
