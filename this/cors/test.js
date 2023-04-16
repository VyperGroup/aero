/**
 * Tests to see if the request would be blocked due to cors rules
 * @param {String} - The url that is being tested
 * @return {Boolean} The result
 */
export default async proxyUrl => {
	try {
		const controller = new AbortController();
		const signal = controller.signal;

		await fetch(proxyUrl, {
			mode: "no-cors",
			signal,
		});

		// Don't actually send the request.
		controller.abort();

		return false;
	} catch (err) {
		return err.name === "AbortError";
	}
};
