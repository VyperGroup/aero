import config from "$aero_config";
const { dynamicConfig, flags } = config;

import getStore from "this/embeds/dynamic/getStore";

const { dbName, id } = dynamicConfig;

// For dynamic config updates
// FIXME: This obviously wouldn't work
export default () => {
	if (flags.dynamicUpdates)
		getStore(dbName, store => {
			self.addEventListener("message", (event: MessageEvent) => {
				const config = event.data;

				if (typeof config === "object" && config.id === id)
					store.add(config);
			});
		});
};
