// Service worker nests

// TODO: Rewrite
importScripts = new Proxy(importScripts, {
	apply() {
		Reflect.apply(...arguments);
	},
});
