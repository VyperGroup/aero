// This api still requires code in the req handler to be finished

// TODO: Define this as a type on a fork
type ListenerInfo = {
	filter: browser.webRequest.RequestFilter;
	extraInfoSpec: string[];
};

import ffAutoGen from "./util/ffAutoGen";

(async () => {
	await ffAutoGen("webRequest");
})();
