// Classic scripts only
if ("importScripts" in self)
	importScripts = new Proxy(importScripts, {
		apply() {
			// TODO: Redirect to the proxy
			Reflect.apply(...arguments);
		},
	});
