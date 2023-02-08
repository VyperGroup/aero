// Worker nests

onevent = new Proxy(onevent, {
	set() {
		return Reflect.apply(...arguments);
	},
});

var oldClientsGet = Clients.get;
Clients.get = async id => {
	const client = await oldClientsGet(id);

	client.url = client.url.match(
		new RegExp(`^(${$aero.config.prefix})/*`, "g")
	)[0];

	return client;
};

/*
self.addEventListener = new Proxy(self.addEventListener, {
	apply(_target, _that, args) {
		const [type, listener] = args;

		// TODO: Intercept

		Reflect.apply(...arguments);
	},
});
*/

// TODO: Make a shared module for location proxying, since it is also used in a window api interceptor
const proxyLocation = {};

self.location = proxyLocation;
