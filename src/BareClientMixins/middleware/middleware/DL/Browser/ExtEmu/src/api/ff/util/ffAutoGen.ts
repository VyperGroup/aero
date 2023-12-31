import getApiProps from "./util/getApiProps";
import getEventName from "./getEventName";

// Auto-gen Events
import { fwdGetter, fwdSetter, fwdToggle, fwdListener } from "./util/Listener";

import { fwdMsg } from "./util/Listener";

// TODO: Make auto-gen precompiled for each file
// TODO: Do something for "You can only call this function from inside the handler for a user action." such as in browserAction.openPopup()
export default (api: keyof browser): void => {
	const props = getApiProps(api);

	browser[api] = {};

	(async () => {
		for (const prop of props) {
			const text = await (
				await fetch(
					`https://raw.githubusercontent.com/mdn/content/main/files/en-us/mozilla/add-ons/webextensions/api/action/${api}/index.md`,
				)
			).text();

			const desc = text
				.match(/{{AddonSidebar\(\)}}(.*)(?=##)/g)[0]
				.replace(/\n/g, " ");

			const propToId = prop.toUpperCase().match(/[a-z]+/g)[0];
			const [performAction] = desc.match(/Perform a \w+/g);

			const noParams = desc.includes("### Parameters  None.");
			const returnsPromise = desc.includes(
				"### Return value  A [`Promise`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)",
			);

			if (performAction) fwdSetter(api, prop, performAction);
			else if (prop === "get()" || prop === "getCurrent()")
				fwdGetter(api, prop, propToId);
			else if (prop === "create()" && desc.startsWith("Creates a "))
				fwdSetter(api, prop, propToId?.replace(/S$/, ""), "create");
			// TODO: Support API.enable() and API.disable() like in the API browserAction
			else if (prop.endsWith("toggle()")) fwdToggle(api, prop, propToId);
			else if (prop.endsWith("()")) {
				if (
					(prop.startsWith("get") && desc.startsWith("Gets")) ||
					desc.startsWith("Checks")
				)
					fwdGetter(
						api,
						prop,
						prop === "get" ? api : getEventName(prop, "get"),
					);
				else if (
					(prop.startsWith("set") &&
						(desc.startsWith("Sets") ||
							desc.startsWith("Enables or disables"))) ||
					(prop.startsWith("open") && desc.startsWith("Open"))
				)
					fwdSetter(api, prop, getEventName(prop, "set"));
				else if (desc.startsWith("Toggles "))
					fwdToggle(api, prop, getEventName(prop, "toggle"));
			} else if (prop.startsWith("on")) {
				const part = getEventName(prop, "on");
				if (
					desc.startsWith("Fired when a request") &&
					desc.startsWith("Sent after ")
				)
					// TODO: const basedOn = desc.match(/Sent after {{WebExtAPIRef\("(.+)"\)}}/g)[0]
					fwdListener("webRequest", part);
				//else if (desc.startsWith("Fired when"));
				// TODO: Automate storage-based apis like cookie and alarms
			}
		}
	})();
};
