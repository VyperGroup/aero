import config from "$src/config";

import getStore from "$embeds/dynamic/getStore";

var FEATURE_DYNAMIC_CONFIG_UPDATES: boolean;

// For dynamic config updates
// FIXME: This obviously wouldn't work
export default () => {
	if (FEATURE_DYNAMIC_CONFIG_UPDATES)
		getStore(config.dynamicConfig.dbName, store => {
			self.addEventListener("message", (event: MessageEvent) => {
				const config = event.data;

				if (typeof config === "object") store.add(config);
			});
		});
};
