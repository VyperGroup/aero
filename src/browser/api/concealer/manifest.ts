import { flags } from "config";

import { proxyConstruct } from "shared/autoProxy/autoProxy";

import afterPrefix from "shared/afterPrefix";

declare var launchQueue;

if (flags.experimental && "launchQueue" in window) {
	proxyConstruct(
		"launchQueue.setConsumer",
		new Map().set(0, (callback: Function) => {
			return params => {
				params.targetUrl = afterPrefix(params.targetUrl);

				callback(params);
			};
		})
	);
}
