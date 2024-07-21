// TODO: I'm deleting this file once I transition to using AeroSandbox

function importAll(ctx) {
	ctx.keys().forEach(ctx);
}

export default (config: AeroSandboxTypes.config) => {
	// Set the defaults assuming that you are using aero
	// TODO: Remove these
	config.redirectors ??= true;
	config.concealers ??= true;
	config.htmlInterception ?? true;
	config.serverParamsPassthrough ??= true;
	config.redirectors ??= true;
	config.nestedSWSupport ??= false;

	// Safety
	config = Object.seal(structuredClone(config));

	// TODO: Import the folders in order
	importAll(require.context(`./src`, true, /\.ts$/));
	// TODO: Make this work with the new proxy middleware standard
	//this.importAll(require.context(`../middleware`, true, /inject.(\.js|\.ts)/));
};
