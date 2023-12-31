// TODO: Replace this with newBrowserData.ts
// I might swap the order of useExt and msg
const getBrowserData = async (
	id: string,
	useExt = false,
	msg: any = "Query",
): Promise<any> =>
	new Promise(res => {
		// TODO: Actually set this properly
		const extID = -1;

		// TODO: Only respond if the msg matches to prevent timing conflicts
		const bc = new BroadcastChannel(
			`${useExt ? "EXT" : "BROWSER"}_${extID}_${id}`,
		);
		bc.onmessage = e => res(e.data);
		bc.postMessage(msg);
	});
const sendBrowserData = (id: string, data = "Send") => {
	const bc = new BroadcastChannel(`BROWSER_${id}`);
	bc.postMessage(data);
};

export { getBrowserData, sendBrowserData };
