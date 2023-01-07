import * as config from "../config.js";

import handleStore from "./handleStore.js";

// Dynamically retrieve the config
export default () => {
	if (config.flags.dynamicConfig)
		handleStore(config.dynamicConfig.name, store => {
			const dbConfig = store.getAll();

			// Could be undefined, or worse erroneous
			return typeof dbConfig === "object" ? dbConfig : config;
		});
	else return config;
};
