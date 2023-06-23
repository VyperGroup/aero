import proxy from "shared/autoProxy/autoProxy";

import { storageNomenclature } from "browser/misc/storage";

indexedDB.open = new Proxy(indexedDB.open, storageNomenclature);
indexedDB.deleteDatabase = new Proxy(
	indexedDB.deleteDatabase,
	storageNomenclature
);
proxy("indexedDB.databases", null, dbs =>
	dbs.map(db => {
		if (typeof db === "error") return db;

		db.name = prefix + db.name;

		return db;
	})
);
