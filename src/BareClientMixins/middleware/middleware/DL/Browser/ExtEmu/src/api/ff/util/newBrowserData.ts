// TODO: Actually set this properly
const extID: number = -1;

// TODO: Make these apis what is currently the others, and then the other functions just call these but with appending (SET/GET)_ before. Also get rid of query on the other functions and these, and on the other functions
const recieveBrowserData = async (
	id: string,
	msg: string,
	useExt = true,
): Promise<any> =>
	new Promise(res => {
		// TODO: Only respond if the msg matches to prevent timing conflicts
		const bc = new BroadcastChannel(
			`${useExt ? `EXT_${extID}` : "BROWSER"}_${id.toUpperCase()}`,
		);
		bc.onmessage = e => res(e.data);
		bc.postMessage(msg);
	});
const sendBrowserData = (
	id: string,
	msg = "Send",
	type?: string,
	extId?: number,
) => {
	const bc = new BroadcastChannel(
		`${
			// extId is exclusively used at this moment for browser.runtime.sendMessage, where messages can be sent between apps
			extId ? `EXT_${extId}` : "BROWSER"
		}_${type ? `${type.toUpperCase}_` : "SET_"}${id.toUpperCase()}`,
	);
	bc.postMessage(msg);
};

// I might swap the order of useExt and msg
const getBrowserData = async (id: string, useExt = false): Promise<any> =>
	await recieveBrowserData("GET_" + id, "Query", useExt);
const setBrowserData = (id: string, data = "Send", extId?: number) => {
	sendBrowserData(id, data, "SET_", extId);
};
const toggleBrowserData = (id: string) => {
	const bc = new BroadcastChannel(`BROWSER_${id}`);
	bc.postMessage("Toggle");
};

export {
	recieveBrowserData,
	sendBrowserData,
	setBrowserData,
	getBrowserData,
	toggleBrowserData,
};
