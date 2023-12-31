import osExtras from "$EXT_EMU_config";

// @ts-ignore
browser.idle = {};

if (osExtras) {
} else {
	const emuState: browser.idle.IdleState = "active";

	browser.idle.queryState = async () => emuState;
	browser.idle.setDetectionInterval = () => {};
}
// TODO: ...
