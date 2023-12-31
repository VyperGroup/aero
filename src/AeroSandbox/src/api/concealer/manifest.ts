import { flags } from "$aero_config";

import { proxyConstruct } from "$aero/shared/autoProxy/autoProxy";

import afterPrefix from "$aero/shared/afterPrefix";

// dom.d.ts doesn't support this yet
declare var launchQueue;

if (flags.experimental && "launchQueue" in window) {
	proxyConstruct(
		"launchQueue.setConsumer",
		new Map().set(0, (callback: Function) => {
			return params => {
				params.targetUrl = afterPrefix(params.targetUrl);

				callback(params);
			};
		}),
	);
}
