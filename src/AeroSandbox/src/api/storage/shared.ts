import { proxyLocation } from "$aero_browser/misc/proxyLocation";

const storagePrefix = () => `${proxyLocation().origin}_`;

const storageNomenclature = {
	apply(target, that, args) {
		const [key] = args;

		args[0] = storagePrefix() + key;

		return Reflect.apply(target, that, args);
	},
};

const storageKey = (key: string) => {
	const prefixSplit = key.split(storagePrefix());

	if (prefixSplit[0] === storagePrefix()) return prefixSplit.slice(1);
	else return null;
};

const storageKeys = (keys: string[]) => {
	let proxyKeys = [];

	for (let key of keys) {
		const prefixSplit = key.split(storagePrefix());

		// FIXME:
		if (prefixSplit[0] === storagePrefix()) null; //proxyKeys.push(prefixSplit.slice(1).join(""));
	}

	return proxyKeys;
};

export { storageNomenclature, storagePrefix, storageKey, storageKeys };
