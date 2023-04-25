import { cacheKey } from "../../config.js";

import Cache from "./Cache.js";

export default class extends Cache {
	/**
	 * @param {headers} - Req headers used to get the cache mode
	 */
	constructor(headers) {
		super();

		// https://fetch.spec.whatwg.org/#concept-request-cache-mode
		if (
			this.mode === "default" &&
			headers.includes([
				"If-Modified-Since",
				"If-None-Match",
				"If-Unmodified-Since",
				"If-Match",
				"If-Range",
			])
		)
			this.mode = "no-store";
		else this.mode = headers["x-aero-cache"] ?? "";
	}

	/**
	 * @param {string} - Proxy origin
	 */
	async clear(origin) {
		const cache = await this.#getCache();

		for (const url of await cache.keys)
			if (url.startsWith(origin)) cache.delete(url);
	}
	/**
	 * @param {string} - Cache Control HTTP Header
	 * @param {string} - Expire HTTP Header for fallback
	 * @returns {number}
	 */
	async getAge(cacheControl, expiry) {
		if (cacheControl) {
			const dirs = cacheControl.split(";").map(dir => dir.trim());

			const secs = dirs
				.find(dir => dir.startsWith("max-age"))
				// FIXME: Breaks on https://dailymail.com
				.split("=")
				.pop();

			return secs + this.getTime;
		} else if (expiry) return this.#parseAge(expiry);

		return false;
	}
	/**
	 * @param {string} - Proxy path
	 * @param {number} - Cache age
	 * @returns {Response | boolean} - Cached resp
	 */
	async get(path, age) {
		const cache = await this.#getCache();

		if (
			// Bypass caches
			this.mode !== "no-store" ||
			this.mode !== "reload" ||
			this.mode !== "no-cache" ||
			// Ignore freshness
			this.mode === "force-cache" ||
			this.mode === "only-if-cached" ||
			// Check the freshness
			this.isFresh(age)
		) {
			const resp = cache.match(path);

			return resp instanceof Response ? resp : false;
		}

		return false;
	}
	/**
	 * @param {string} - Proxy path
	 * @param {string} - Proxy resp
	 * @param {string} - Vary header
	 */
	async set(path, resp, vary) {
		const cache = await this.#getCache();

		if (
			this.mode !== "no-store" &&
			this.mode !== "only-if-cached" &&
			vary === "*"
		)
			await cache.put(path, resp);
	}

	async #getCache() {
		return await caches.open(cacheKey);
	}
	// Convert expiry date to seconds
	#parseAge(expiry) {
		return (Date.parse(expiry).getTime() / 1000) | 0;
	}

	get bypass() {
		return this.mode === "no-store" || this.mode === "reload";
	}
}
