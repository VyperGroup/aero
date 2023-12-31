import { cacheKey } from "$aero_config";

import Cache from "./Cache";

export default class extends Cache {
	mode: RequestCache;

	/**
	 * @param - Req headers used to get the cache mode
	 */
	constructor(headers: object) {
		super();

		// https://fetch.spec.whatwg.org/#concept-request-cache-mode
		if (
			this.mode === "default" &&
			((): boolean => {
				for (const header of [
					"If-Modified-Since",
					"If-None-Match",
					"If-Unmodified-Since",
					"If-Match",
					"If-Range",
				])
					if (Object.keys(headers).includes(header)) return true;
				return false;
			})()
		)
			this.mode = "no-store";
		else this.mode = headers["x-aero-cache"] ?? "";
	}

	/**
	 * @param - Proxy origin
	 */
	async clear(origin: string): Promise<void> {
		const cache = await this.#getCache();

		for await (const url of cache.keys)
			if (url.startsWith(origin)) cache.delete(url);
	}
	/**
	 * @param - Cache Control HTTP Header
	 * @param - Expire HTTP Header for fallback
	 * @returns
	 */
	async getAge(
		cacheControl: string,
		expiry: string
	): Promise<number | false> {
		if (cacheControl) {
			const dirs = cacheControl.split(";").map(dir => dir.trim());

			const secs = parseInt(
				dirs
					.find(dir => dir.startsWith("max-age"))
					// FIXME: Breaks on https://dailymail.com
					.split("=")
					.pop()
			);

			return secs ? secs + this.getTime : false;
		} else if (expiry) return this.#parseAge(expiry);

		return false;
	}
	/**
	 * @param - Proxy path
	 * @param - Cache age
	 * @returns Cached resp
	 */
	async get(path, age): Promise<Response | false> {
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
	 * @param - Proxy path
	 * @param - Proxy resp
	 * @param - Vary header
	 */
	async set(path: string, resp: Response, vary: string): Promise<void> {
		const cache = await this.#getCache();

		if (
			this.mode !== "no-store" &&
			this.mode !== "only-if-cached" &&
			vary === "*"
		)
			await cache.put(path, resp);
	}

	async #getCache(): Promise<globalThis.Cache> {
		return await caches.open(cacheKey);
	}
	// Convert expiry date to seconds
	#parseAge(expiry: string): number {
		return (Date.parse(expiry).getTime() / 1000) | 0;
	}

	get bypass() {
		return this.mode === "no-store" || this.mode === "reload";
	}
}
