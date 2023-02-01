// Service worker nests

// TODO: Rewrite
importScripts = new Proxy(importScripts, {
	apply(target, that, args) {
		Reflect.apply(...arguments);
	},
});
