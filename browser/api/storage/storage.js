// Local Storage
Storage.prototype.setItem = new Proxy(
	Storage.prototype.setItem,
	$aero.storageNomenclature
);
Storage.prototype.getItem = new Proxy(
	Storage.prototype.getItem,
	$aero.storageNomenclature
);
Storage.prototype.removeItem = new Proxy(
	Storage.prototype.getItem,
	$aero.storageNomenclature
);

{
	Storage.prototype.clear = new Proxy(Storage.prototype.clear, {
		apply() {
			for (let i = 0; i < localStorage.length; i++) {
				const key = keyBak(i);

				if (key.startsWith(prefix)) localStorage.removeItem(key);
			}
		},
	});
}

/*
Storage.prototype.key = new Proxy(Storage.prototype.key, {
	apply(target, that, args) {
		const [index] = args;

		let keys = [];

		for (let i = 0; i < localStorage.length; i++) {
			// FIXME: Illegal invocation
			const key = target(i);

		if (key.startsWith(prefix))
			keys.append(key.slice(str.indexOf(prefix) + prefix.length));
		}

		return keys[index];
	},
});
*/

// TODO: Rewrite StorageEvent
