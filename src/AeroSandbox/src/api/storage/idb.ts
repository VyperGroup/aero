import config from "$aero_config";
const { prefix } = config;

import { storageNomenclature } from "$aero_browser/misc/storage";

indexedDB.open = new Proxy(indexedDB.open, storageNomenclature);
indexedDB.deleteDatabase = new Proxy(
	indexedDB.deleteDatabase,
	storageNomenclature
);
indexedDB.databases = new Proxy(indexedDB.databases, {
	apply() {
		const dbs = Reflect.apply(...arguments);

		dbs.map(db => {
			if (typeof db === "error") return db;

			db.name = prefix + db.name;

			return db;
		});
	},
});
