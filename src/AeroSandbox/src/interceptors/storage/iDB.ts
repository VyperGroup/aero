import { APIInterceptor } from "$types/apiInterceptors";

import config from "$aero/config";

import { storageNomenclature } from "./shared";

const { prefix } = config;

export default [
  {
    proxifiedObj: Proxy.revocable(indexedDB.open, storageNomenclature),
    globalProp: "indexedDB.open",
  },
  {
    proxifiedObj: Proxy.revocable(
      indexedDB.deleteDatabase,
      storageNomenclature
    ),
    globalProp: "indexedDB.deleteDatabase",
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

          db.name = prefix + db.name;

          return db;
        });
      },
    }),
    globalProp: "indexedDB.databases",
  },
] as APIInterceptor[];
