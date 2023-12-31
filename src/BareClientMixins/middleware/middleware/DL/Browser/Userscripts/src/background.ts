import localStorage from "localforage";

const store = localStorage.createInstance({
	name: "USERSCRIPTS",
});

import getScripts from "./getScripts";

new BroadcastChannel("USERSCRIPTS_INSTALL").onmessage = async e =>
	await store.setItem("scripts", [...(await getScripts()), e.data]);
new BroadcastChannel("USERSCRIPTS_REMOVE").onmessage = async e => {
	const name = e.data;
	if (typeof name === "string") {
		const scripts = await getScripts();

		scripts.filter(script => script.meta.name === name);

		await store.setItem("scripts", scripts);
	}
};
new BroadcastChannel("USERSCRIPTS_CLEAR").onmessage = async e =>
	await store.removeItem("scripts");
