import config from "$src/config";

import getStore from "./getStore";

interface cfg {
	backends: string[];
}

// Dynamically retrieve the config
export default (): cfg /*config*/ => {
	// FIXME: This code is a mess and it obviously wouldn't work
	if (config.flags.dynamicUpdates) {
		getStore(config.dynamicConfig.dbName, store => {
			const dbConfig = store.getAll();

			// Could be undefined, or worse erroneous
			return typeof dbConfig === "object" ? dbConfig : config;
		});
		return config;
	} else return config;
};
