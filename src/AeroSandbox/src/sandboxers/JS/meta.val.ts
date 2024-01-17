// Handled by val-loader (val.ts)

export default (options, loaderContext) => {
	return {
		code: /* js */ `
import afterPrefix from "$aero/shared/hared/afterPrefix";

import.meta.resolve = new Proxy(import.meta.resolve, {
	apply(target, that, args) {
	let ret = Reflect.apply(target, that, args);

		// TODO: Prevent ../.. from being behind /go/

		return afterPrefix(ret);
	},

import.meta.url = afterPrefix(import.meta.url);
	`,
	};
};
