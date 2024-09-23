import { escapeWithOrigin } from "$aero/src/shared/escape";

const storagePrefix = escapeWithOrigin;

const storageNomenclature = {
	apply(target, that, args) {
		const [key] = args;

		args[0] = storagePrefix(key);

		return Reflect.apply(target, that, args);
	}
};

function storageKey(key: string) {
	const getUnproxifiedStorageKey = key.split(storagePrefix(""));

	if (getUnproxifiedStorageKey[0] === storagePrefix(""))
		return getUnproxifiedStorageKey.slice(1);
	else return null;
}

function storageKeys(keys: string[]) {
	const proxyKeys = [];

	/*escapeWithProxyOrigin
	for (let key of keys) {
		const prefixSplit = key.split(storagePrefix());

		// FIXME:
		if (prefixSplit[0] === storagePrefix()) null; //proxyKeys.push(prefixSplit.slice(1).join(""));
	}
	*/

	return proxyKeys;
}

export { storageNomenclature, storagePrefix, storageKey, storageKeys };
