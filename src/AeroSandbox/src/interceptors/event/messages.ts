import proxy from "$shared/stringProxy";

import { afterPrefix } from "$shared/getProxyUrl";

import { proxyLocation } from "$shared/proxyLocation";

import { storageKey } from "$aero_browser/misc/storage";

// TODO: Adopt the new API Interceptor design
// Sender
// FIXME: Breaks on Google
/*
postMessage = new Proxy(postMessage, {
	apply(target, that, args) {
		let [data, origin] = args;

		if (origin !== "*") {
			args[1] = "*";

			data.origin = origin;

			args[0] = data;
		}

		return Reflect.apply(target, that, args);
	},
});
*/

function eventInterceptor(type: string, listener: Function) {
	if (type === "message" || type === "messageerror")
		return event => {
			if (event instanceof MessageEvent)
				if (event.origin === proxyLocation().origin) {
					Object.defineProperty(event, "origin", {
						value: proxyLocation().origin,
						writable: false
					});
					listener(event);
				}
		};
	if (type === "storage") {
		return event => {
			if (event instanceof StorageEvent) {
				Object.defineProperty(event, "url", {
					value: afterPrefix(event.url),
					writable: false
				});

				// Ensure the event isn't a clear event
				if (event.key !== null) {
					const proxyKey = storageKey(event.key);

					if (proxyKey !== null)
						Object.defineProperty(event, "key", {
							value: proxyKey,
							writable: false
						});
				}
			}
			listener(event);
		};
	}
	if (type === "hashchange") {
		return event => {
			if (event instanceof HashChangeEvent) {
				Object.defineProperty(event, "newURL", {
					value: afterPrefix(event.newURL),
					writable: false
				});
				Object.defineProperty(event, "oldURL", {
					value: afterPrefix(event.oldURL),
					writable: false
				});
			}
			listener(event);
		};
	}

	return listener;
}
function setHandler(type: string) {
	let set;
	Object.defineProperty(window, `on${type}`, {
		set: listener => {
			set = eventInterceptor(type, listener);
		},
		get: () => set
	});
}

setHandler("message");
setHandler("messageerror");
setHandler("storage");
setHandler("hashchange");

// Reciever concealer
// @ts-ignore
proxy("addEventListener", new Map(1, eventInterceptor));
