import {
	storagePrefix,
	storageKeys,
	storageNomenclature,
} from "browser/misc/storage";

// Local Storage
Storage.prototype.setItem = new Proxy(
	Storage.prototype.setItem,
	storageNomenclature
);
Storage.prototype.getItem = new Proxy(
	Storage.prototype.getItem,
	storageNomenclature
);
Storage.prototype.removeItem = new Proxy(
	Storage.prototype.getItem,
	storageNomenclature
);

/*
Storage.prototype.clear = new Proxy(Storage.prototype.clear, {
	apply(target) {
		for (const key of Object.keys(target))
			if (key.startsWith(storagePrefix())) target.remove(key);
	},
});
*/

/*
Storage.prototype.key = new Proxy(Storage.prototype.key, {
	apply(target, that, args) {
		const [i] = args;

		let proxyKeys = [];

		for (const key of Object.keys(target))
			if (key.startsWith(storagePrefix()))
				proxyKeys.push(
					key.slice(
						// FIXME: What is str supposed to be?
						str.indexOf(storagePrefix()) +
							storagePrefix().length
					)
				);

		return proxyKeys[i];
	},
});
*/

/*
Storage = new Proxy(Storage, {
	getOwnPropertyDescriptor: () => ({
		enumerable: true,
		configurable: true,
	}),
	ownKeys(target) {
		const keys = Reflect.ownKeys(target);

		return storageKeys(keys);
	},
});
*/
