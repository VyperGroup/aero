import { flags } from "../config.js";

/**
 * Tests to see if the request would be blocked due to cors rules
 * @param {String} - url The url that is being tested
 * @return {Boolean} The result
 */
export default async url => {
	if (!flags.corsEmulation) return false;

	// Doesn't always work
	try {
		const controller = new AbortController();
		const signal = controller.signal;

		await fetch(url, { signal });

		// Don't actually send the request.
		controller.abort();

		return true;
	} catch (err) {
		return err.name === "AbortError";
	}
};
