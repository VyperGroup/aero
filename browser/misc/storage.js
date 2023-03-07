$aero.storagePrefix = {
	get: () => `${$aero.proxyLocation.origin}_`,
};

$aero.storageNomenclature = {
	apply(_target, _that, args) {
		const [key] = args;

		args[0] = prefix + key;

		return Reflect.apply(...arguments);
	},
};

$aero.storageKey = key => {
	const prefixSplit = key.split(prefix);

	if (prefixSplit[0] === prefix) return prefixSplit.slice(1);
	else return null;
};

$aero.storageKeys = keys => {
	let proxyKeys = [];

	for (let key of keys) {
		const prefixSplit = key.split(prefix);

		if (prefixSplit[0] === prefix) proxyKeys.append(prefixSplit.slice(1));
	}

	return proxyKeys;
};
