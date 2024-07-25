import type { AeroLogger } from "$sandbox/shared/Loggers";
declare const self: WorkerGlobalScope &
	typeof globalThis & {
		logger: AeroLogger;
	};

type getStoreHandler = (store: IDBObjectStore) => {
	// TODO: Implement;
};

// A safe astraction to get the actual config store that aero needs
export default (dbName: string, func: Function) => {
	const req = indexedDB.open(dbName);

	req.onsuccess = () => {
		const db = req.result;

		// Error here
		const transaction = db.transaction("config", "readwrite");

		transaction.oncomplete = () => {
			const store = transaction.objectStore("config");

			if (store instanceof IDBOpenDBRequest) func(store);
			else $aero.logger.error(`Unable to get store for config`);
		};
	};

	req.onerror = err => {
		self.logger.error(
			`Error initializing the db for dynamic config updates: ${err}`
		);
	};
};
