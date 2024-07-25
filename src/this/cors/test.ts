// Tests to see if the request would be blocked due to cors rules
export default async (proxyUrl: string): Promise<boolean> => {
	try {
		const controller = new AbortController();
		const signal = controller.signal;

		await fetch(proxyUrl, {
			mode: "no-cors",
			// Prevent the unnecessary transfer of the response body, if the request was actually fulfilled, which I doubt would happen anyways
			method: "HEAD",
			signal
		});

		// Don't actually send the request
		controller.abort();

		return false;
	} catch (err) {
		return err instanceof Error && err.name === "AbortError";
	}
};
