chrome.webRequest.onActionIgnored;
chrome.webRequest.onAuthRequired;
chrome.webRequest.onBeforeRedirect;

{
	let callbacks = [];

	const brReq = new BroadcastChannel("EXT_BEFOREREQ");
	const brBlock = new BroadcastChannel("EXT_BLOCKREQ");
	brReq.onmessage(e => {
		for (const callback of callbacks) {
			const blockingResp = callback.callback(e.data);
			// TODO: Finished
			if (blockingResp);
		}
	});

	type Callback = (details: object) => BlockingResponse | undefined;
	chrome.webRequest.onBeforeRequest = (
		callback: Callback,
		filter: RequestFilter,
		extraInfoSpec?: OnBeforeRequestOptions[],
	) => {
		callbacks += { ...args };
	};
}

{
	const brReqHeaders = new BroadcastChannel("EXT_BEFOREREQHEADERS");
	chrome.webRequest.onBeforeSendHeaders = (
		callback: function,
		filter: RequestFilter,
		extraInfoSpec?: OnCompletedOptions[],
	) => {
		callback;
	};
}

chrome.webRequest.onCompleted;
