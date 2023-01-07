import headersToObject from "./headersToObject.js";

export default class {
	/**
	 * A wrapper for Fetch that routes all requests through the proxy backend
	 * @constructor
	 * @param {string} - The api route for the proxy backend
	 */
	constructor(endpoint) {
		this.endpoint = endpoint;
	}
	fetch(url, opts) {
		let ret = {
			method: opts && "method" in opts ? opts.method : "GET",
			headers: {
				"x-url": url,
				"x-headers": "{}",
			},
		};

		if (typeof opts !== "undefined") {
			if ("body" in opts) ret.body = opts.body;
			if ("headers" in opts)
				ret.headers["x-headers"] = JSON.stringify(
					headersToObject(opts.headers)
				);
		}

		return fetch(this.endpoint, ret);
	}
}
