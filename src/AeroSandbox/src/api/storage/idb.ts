import { prefix } from "$aero_config";

import proxy from "shared/autoProxy/autoProxy";

import { storageNomenclature } from "browser/misc/storage";

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
