import * as config from "../config.js";

import getStore from "./getStore.js";

// Dynamically retrieve the config
export default () => {
	if (config.flags.dynamicConfig)
		getStore(config.dynamicConfig.name, store => {
			const dbConfig = store.getAll();

			// Could be undefined, or worse erroneous
			return typeof dbConfig === "object" ? dbConfig : config;
		});
	else return config;
};
