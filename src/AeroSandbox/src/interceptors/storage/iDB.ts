import { APIInterceptor } from "$types/apiInterceptors";

import { storageNomenclature } from "./shared";

export default [
	{
		proxifiedObj: Proxy.revocable(indexedDB.open, storageNomenclature),
		globalProp: "indexedDB.open"
	},
	{
		proxifiedObj: Proxy.revocable(
			indexedDB.deleteDatabase,
			storageNomenclature
		),
		globalProp: "indexedDB.deleteDatabase"
	},
	{
		proxifiedObj: Proxy.revocable(indexedDB.databases, {
			async apply(target, that, args) {
				const dbs = (await Reflect.apply(
					target,
					that,
					args
				)) as IDBDatabaseInfo[];

				dbs.map(db => {
					if (db instanceof Error) return db;

					db.name = self.config.prefix + db.name;

					return db;
				});
			}
		}),
		globalProp: "indexedDB.databases"
	}
] as APIInterceptor[];
