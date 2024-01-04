import config from "$aero_config";
const { prefix } = config;

import proxy from "$aero/shared/autoProxy/autoProxy";

import { storageNomenclature } from "$aero_browser/misc/storage";

indexedDB.open = new Proxy(indexedDB.open, storageNomenclature);
indexedDB.deleteDatabase = new Proxy(
	indexedDB.deleteDatabase,
	storageNomenclature,
);
proxy("indexedDB.databases", undefined, dbs =>
	dbs.map(db => {
		if (db instanceof Error) return db;

		db.name = prefix + db.name;

		return db;
	}),
);
