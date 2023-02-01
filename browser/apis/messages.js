postMessage = new Proxy(postMessage, {
	apply(target, that, args) {
		[data, origin] = args;

		if (origin !== "*") {
			args[1] = "*";

			data.origin = origin;
			args[0] = data;
		}

		console.log(args);

		return Reflect.apply(...arguments);
	},
});

addEventListener = new Proxy(addEventListener, {
	apply(target, that, args) {
		[type, listener] = args;

		if (type === "message")
			listener = event => {
				event.origin = $aero.proxyLocation.origin;

				const origin = event.data.origin;
				delete event.data.origin;

				if (origin == $aero.proxyLocation.origin) listener(event);
			};

		args[2] = listener;

		return Reflect.apply(...arguments);
	},
});
