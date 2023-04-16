// For the SW
if (typeof $aero === "undefined") var $aero = {};

// TODO: Include this on the top of every inline script (after use strict);
$aero.meta = `
import.meta.resolve = new Proxy(import.meta.resolve, {
	apply(_target, _that, args) {
		let ret = Reflect.apply(...arguments);

		// TODO: Prevent ../... from being behind /go/

		return $aero.afterPrefix(ret);
	},
});

import.meta.url = $aero.afterPrefix(import.meta.url);
`;

export default $aero.meta;
