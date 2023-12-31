import prefix from "./prefix";

import proxy from "./autoProxy";

if (navigator.serviceWorker.controller)
	proxy(
		navigator.serviceWorker.controller.postMessage,
		new Map().set(0, data => {
			ns: prefix;
			data;
		}),
	);
