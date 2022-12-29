(() => {
	const prefix = `${$aero.proxyLocation.origin}_`;

	const storageNomenclature = {
		apply(target, that, args) {
			[key] = args;

			args[0] = prefix + key;

			Reflect.apply(...arguments);
		},
	};

	// IndexedDB
	window.indexedDB.open = new Proxy(indexedDB.open, storageNomenclature);
	window.indexedDB.deleteDatabase = new Proxy(
		indexedDB.deleteDatabase,
		storageNomenclature
	);
	window.indexedDB.databases = new Proxy(indexedDB.databases, {
		apply(target, that, args) {
			const dbs = Reflect.apply(...arguments);

			dbs.map(db => {
				if (typeof db === "error") return db;

				db.name = prefix + db.name;

				return db;
			});
		},
	});

	// Local Storage

	// To prevent issues when overwritten
	const keyBak = Storage.prototype.key;

	window.Storage.prototype.setItem = new Proxy(
		Storage.prototype.setItem,
		storageNomenclature
	);
	window.Storage.prototype.getItem = new Proxy(
		Storage.prototype.getItem,
		storageNomenclature
	);
	window.Storage.prototype.removeItem = new Proxy(
		Storage.prototype.getItem,
		storageNomenclature
	);
	window.Storage.prototype.clear = new Proxy(Storage.prototype.clear, {
		apply() {
			for (let i = 0; i < localStorage.length; i++) {
				const key = keyBak(i);

				if (key.startsWith(prefix)) localStorage.removeItem(key);
			}
		},
	});
	/*
	window.Storage.prototype.key = new Proxy(Storage.prototype.key, {
		apply(target, that, args) {
			[index] = args;

			let keys = [];

			for (let i = 0; i < localStorage.length; i++) {
				// Illegal invocation
				const key = target(i);

				if (key.startsWith(prefix))
					keys.append(key.slice(str.indexOf(prefix) + prefix.length));
			}

			return keys[index];
		},
	});
	*/

	// Rewrite StorageEvent
})();
