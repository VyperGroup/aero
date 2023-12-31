import { getBrowserData, sendBrowserData } from "util/browserData";

import ffAutoGen from "./util/ffAutoGen.js";

import storageProxy from "./util/storageProxy.js";

(async () => {
	await ffAutoGen("sessions");
})();

// TODO: Finish all the methods

storageProxy("sessions", "Tab");
storageProxy("sessions", "Win");

// TODO: sessions.onchanged
