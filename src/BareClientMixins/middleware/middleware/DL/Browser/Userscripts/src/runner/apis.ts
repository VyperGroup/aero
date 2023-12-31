import { match } from "this/misc/match";

import localStorage from "localforage";
const tabStore = localStorage.createInstance({
	name: "MW_USERSCRIPTS_TABS",
});
const scriptStore = localStorage.createInstance({
	name: "MW_USERSCRIPTS_STORE",
});

// For GM_notification
type NotifHandlers = {
	click: Array<Function>;
	done: Array<Function>;
};
let notifHandlers: NotifHandlers = {
	click: [],
	done: [],
};
const bcNotif = new BroadcastChannel("BROWSER_NOTIF");
bcNotif.addEventListener("message", e => {
	const type = e.data;

	if (type === "click") notifHandlers.click.forEach(func => func());
	else if (type === "done") notifHandlers.done.forEach(func => func());
});

// For GM_registerMenuCommand
const bcRegMenu = new BroadcastChannel("USERSCRIPT_REG_MENU_CMD");
const itemSelectCallbacks: Array<Function> = [];
bcRegMenu.addEventListener("message", e =>
	itemSelectCallbacks.forEach(func => func()),
);

// For tabs
function genID() {
	return Math.random() * Math.pow(10, 18);
}

export default meta => {
	const apis = {
		GM_addElement: function () {
			const argLen = arguments.length;
			if (argLen >= 3) {
				const [parent_node, tag_name, attributes]: [
					HTMLElement,
					keyof HTMLElementTagNameMap,
					object,
				] = arguments;

				const el = document.createElement(tag_name);

				for (const [attr, val] of Object.entries(attributes))
					el.setAttribute(attr, val);

				// Don't rewrite
				el.setAttribute("observed", "");

				parent_node.appendChild(el);
			} else if (argLen === 2) {
				const [tag_name, attributes]: [
					keyof HTMLElementTagNameMap,
					object,
				] = arguments;

				const el = document.createElement(tag_name);

				for (const [attr, val] of Object.entries(attributes))
					el.setAttribute(attr, val);

				// Don't rewrite
				el.setAttribute("observed", "");

				document.body.appendChild(el);
			}
		},
		GM_addStyle(css) {
			const style = document.createElement("style");
			style.textContent = css;
			document.body.appendChild(style);
			return style;
		},
		GM_download() {
			const argLen = arguments.length;
			if (argLen >= 2) {
				const [details]: [object] = arguments;

				const xhr = new XMLHttpRequest();

				xhr.responseType = "blob";
				xhr.open("get", details.url);
				for (const [key, val] of details.headers)
					xhr.setRequestHeader(key, val);

				// Events
				xhr.onload = details.onload;
				xhr.onerror = details.onerror;
				xhr.onprogress = details.onprogress;
				xhr.ontimeout = details.ontimeout;

				// Dl
				const a = document.createElement("a");
				const dlBlob = URL.createObjectURL(xhr.response);
				a.download = dlBlob;
				a.click();
				// Don't rewrite
				a.setAttribute("observed", "");
				document.body.appendChild(a);
				URL.removeObjectURL(dlBlob);
				a.remove();
			} else {
				const [url, name]: [string, string] = arguments;

				// Dl
				const dlBlob = URL.createObjectURL(url);
				const a = document.createElement("a");
				a.download = dlBlob;
				a.click();
				// Don't rewrite
				a.setAttribute("observed", "");
				document.body.appendChild(a);
				URL.removeObjectURL(dlBlob);
				a.remove();
			}
		},
		GM_getResourceText(name) {
			const url = new URL(name, location.href);
			url.searchParams.set("bypassCORS", "");
			return (async () => await (await fetch(url)).text())();
		},
		GM_getResourceURL(name) {
			return new URL(name, location.href).href;
		},
		GM_info() {
			return meta;
		},
		GM_notification() {
			const argLen = arguments.length;
			if (argLen >= 4) {
				const [text, title, image, onclick] = arguments;

				notifHandlers.click.push(onclick);

				bcNotif.postMessage(
					JSON.stringify({
						text,
						title,
						image,
					}),
				);
			} else {
				const [details, ondone] = arguments;

				notifHandlers.click.push(details.onclick);
				notifHandlers.click.push(details.ondone);
				notifHandlers.done.push(ondone);

				delete details.onclick;
				delete details.ondone;

				bcNotif.postMessage(JSON.stringify(details));
			}
		},
		GM_registerMenuCommand(name, callback, accessKey) {
			bcRegMenu.postMessage(
				JSON.stringify({
					name,
					shortcut: accessKey,
				}),
			);

			itemSelectCallbacks.push(callback);
		},
		GM_setClipboard(data: string, info) {
			const blob = new Blob([data], { type: info.mimetype });
			navigator.clipboard.write([
				new ClipboardItem({
					[blob.type]: blob,
				}),
			]);
		},
		GM_getTab(tabHandler) {
			tabHandler(genID());
		},
		GM_getTabs(tabs) {
			let obj = {};
			(async () => {
				const map = await tabStore.getItem(tabs);
				if (map instanceof Map)
					for (const [tabId, tab] of map) obj[tabId] = tab;
			})();
			return obj;
		},
		GM_setValue: scriptStore.setItem,
		GM_getValue: scriptStore.getItem,
		GM_deleteValue: scriptStore.removeItem,
		GM_xmlhttpRequest(details) {
			let allowReq = false;
			if (meta.connect.includes("*")) allowReq = true;
			if (match(location.hostname, details.url)) allowReq = true;
			else
				for (const conn of meta.connect)
					if (match(conn, details.url)) allowReq = true;

			// TODO: Finish the other details properties

			const xhr = new XMLHttpRequest();

			xhr.onabort = details.onabort;
			xhr.onerror = details.onerror;
			xhr.onloadstart = details.onloadstart;
			xhr.onprogress = details.onprogress;
			xhr.onreadystatechange = details.onreadystatechange;
			xhr.ontimeout = details.ontimeout;
			xhr.onload = details.onload;

			for (const [key, val] of details.headers)
				xhr.setRequestHeader(key, val);
			xhr.setRequestHeader("cookie", details.cookie);

			xhr.open(details.method, details.url);

			xhr.send(details.data);
		},
		GM_log: console.log,
		GM_cookie: {},
	};

	for (const prop of Object.keys(apis))
		if (!meta.grant.includes(prop)) delete apis[prop];

	return apis;
};
