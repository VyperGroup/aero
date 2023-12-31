let chrome = {
	accessibilityFeatures: {},
	action: {},
	alarms: {},
	audio: {},
	bookmarks: {},
	browserAction: {},
	browsingData: {},
	certificateProvider: {},
	commands: {},
	contentSettings: {},
	contextMenus: {},
	cookies: {},
	debugger: {},
	declarativeContent: {},
	declarativeNetRequest: {},
	desktopCapture: {},
	devtools: {},
};

const ctx = require.context(`./api`, true, /\.ts$/);
ctx.keys().forEach(ctx);
