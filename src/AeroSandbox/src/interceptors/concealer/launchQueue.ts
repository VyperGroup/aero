import config from "$aero_config";
const { flags } = config;

import afterPrefix from "$aero/shared/afterPrefix";

// TODO: Import the W3 WebIDL typings dom.d.ts doesn't support this yet
declare let launchQueue: any;

if ("launchQueue" in window)
	launchQueue.setConsumer = new Proxy(launchQueue.setConsumer, {
		apply(_target, _that, args) {
			const [callback] = args;

			// Intercept the manifest
			return params => {
				params.targetUrl = $aero.afterPrefix(params.targetUrl);

				callback(params);
			};
		},
	});
