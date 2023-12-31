import { getBrowserData } from "util/browserData";

// @ts-ignore
browser.notifications = {};

browser.notifications.clear = id => getBrowserData("CLEAR_NOTIF", null, id);
// browser.notifications.create = (id, opts) => getBrowserData("CREATE_NOTIF", null, { create, opts });
// TODO: ...

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/notifications
