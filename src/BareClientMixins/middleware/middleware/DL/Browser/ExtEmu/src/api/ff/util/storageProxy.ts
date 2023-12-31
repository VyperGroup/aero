import localStorage from "localforage";

async function getStore(namespace, tabId) {
	return localStorage.createInstance({
		name: `STORE_${namespace}_${tabId}`,
	});
}

export default async (apiName: string, namespace: string): void => {
	browser[apiName][`set${namespace}Value`] = async (tabId, key, val) =>
		await getStore(namespace, tabId).setItem(key, val);
	browser[apiName][`get${namespace}Value`] = async (tabId, key, val) =>
		await getStore(namespace, tabId).getItem(key, val);
	browser[apiName][`remove${namespace}Value`] = async (tabId, key, val) =>
		await getStore(namespace, tabId).removeItem(key, val);
};
