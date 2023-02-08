// Sender
postMessage = new Proxy(postMessage, {
	apply(_target, _that, args) {
		let [data, origin] = args;

		if (origin !== "*") {
			args[1] = "*";

			data.origin = origin;

			args[0] = data;
		}

		console.log(args);

		return Reflect.apply(...arguments);
	},
});

// Reciever concealer
addEventListener = new Proxy(addEventListener, {
	apply(_target, _that, args) {
		const [type, listener] = args;

		if (type === "message")
			args[2] = event => {
				event.origin = $aero.proxyLocation.origin;

				const origin = event.data.origin;
				delete event.data.origin;

				if (origin == $aero.proxyLocation.origin) listener(event);
			};

		return Reflect.apply(...arguments);
	},
});
