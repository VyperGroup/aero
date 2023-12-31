import { setBrowserData, getBrowserData } from "./util/newBrowserData";

import getEventName from "./getEventName";

// This is is primarily used for offloading to requests, such as with webRequest
function fwdGetter(api: object, prop: string, eventName: string) {
	browser.api[prop] = async function () {
        await getBrowserData(eventName)
    };
};
function fwdSetter(obj: object, prop: string, eventName: string, type?: string) {
    browser.api[prop] = async function (msg: any) {
        await sendBrowserData(eventName, msg, type)
    };
};

// This is is primarily used for offloading to requests, such as with webRequest
function fwdListener(api: object, eventName: string) => {
	const event = `on${eventName}`;

	api[event].addListener = async function () {
		await sendBrowserData.call(`EXT_EVENT_${getEventName(eventName)}_LISTENERS`, ...arguments);
	};
	api[event].removeListener = async () => {
		await sendBrowserData(`EXT_EVENT_${getEventName(eventName)}`, "Remove");
	};
	api[event].hasListener = async () => await getBrowserData(`EXT_EVENT_${getEventName(eventName)}`);
};

export { fwdGetter, fwdSetter, fwdListener };