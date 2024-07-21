import { APIInterceptor } from "$aero/types";

import config from "$aero/config";

import { storageNomenclature } from "./shared";

const { prefix } = config;

export default [
	{
		proxifiedObj: new Proxy(indexedDB.open, storageNomenclature),
		globalProp: "indexedDB.open",
	},
	{
		proxifiedObj: new Proxy(indexedDB.deleteDatabase, storageNomenclature),
		globalProp: "indexedDB.deleteDatabase",
	},
	{
		proxifiedObj: new Proxy(indexedDB.databases, {
			async apply(target, that, args) {
				const dbs = (await Reflect.apply(
					target,
					that,
					args
				)) as IDBDatabaseInfo[];

				dbs.map(db => {
					if (db instanceof Error) return db;

					db.name = prefix + db.name;

					return db;
				});
			},
		}),
		globalProp: "indexedDB.databases",
	},
] as APIInterceptor[];
