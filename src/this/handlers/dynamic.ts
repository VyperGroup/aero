import { dynamicConfig, flags } from "config";

import getStore from "this/dynamic/getStore";

const { dbName, id } = dynamicConfig;

// For dynamic config updates
export default () => {
	if (flags.dynamicUpdates)
		getStore(dbName, store => {
			self.addEventListener("message", event => {
				const config = event.data;

				if (typeof config === "object" && config.id === id)
					store.add(config);
			});
		});
};
