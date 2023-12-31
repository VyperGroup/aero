import ffAutoGen from "./util/ffAutoGen.js";

import { fwdSetter } from "./util/Listener.js";

(async () => {
	await ffAutoGen("sidebarAction");

	fwdSetter("sidebarAction", "open", "OPEN_SIDEBAR");
	fwdSetter("sidebarAction", "close", "CLOSE_SIDEBAR");
})();
