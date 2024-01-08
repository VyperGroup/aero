// Deprecated
{
	type Callback = () => void;
	chrome.mdns.forceDiscovery = (callback: ?Callback) => {};
}

{
	type Callback = (services: ?MDnsService) => void;
	chrome.mdns.onservicelist = {
		addListener: (callback: Callback) => {
			callback;
		},
	};
}
