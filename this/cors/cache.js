import { cacheKey } from "../../config";

const cache = await caches.open("httpCache");

function getTime() {
	return Date.now() / 1000;
}
/**
 *
 * @param {string} - Proxy origin
 */
async function clearCache(origin) {
	for (const url of await caches.keys)
		if (url.startsWith(origin)) caches.delete(url);
}

/**
 * @param {string} - Cache Control HTTP Header
 * @param {string} - Expire HTTP Header for fallback
 * @returns {number}
 */
async function getCacheAge(cacheControl, expiry) {
	if (cacheControl) {
		const dirs = cacheControl.split(";").map(dir => dir.trim());

		const secs = dirs
			.find(dir => dir.startsWith("max-age"))
			.split("=")
			.pop();

		return secs + getTime();
	} else if (expiry) return Date.parse(expiry).getTime() / 1000;
	return false;
}

/**
 * @param {string} - Proxy path
 * @returns {Response | boolean} - Cached resp
 */
async function getCache(path) {
	const resp = caches.match(cacheKey + path);

	return resp ? resp : false;
}
/**
 * @param {string} - Proxy path
 * @param {string} - Proxy resp
 * @param {number} - Cache age
 */
async function setCache(path, resp, age) {
	if (age < getTime()) caches.put(cacheKey + path, resp);
}

export { clearCache, getCacheAge, getCache, setCache };
