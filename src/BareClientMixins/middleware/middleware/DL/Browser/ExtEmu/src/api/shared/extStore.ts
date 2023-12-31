import localStorage from "localforage";

export default async id =>
	localStorage.createInstance({
		name: `EXT_${extId}_${id.toUpperCase()}`,
	});
