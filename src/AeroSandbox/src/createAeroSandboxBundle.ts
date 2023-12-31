function importAll(ctx) {
	ctx.keys().forEach(ctx);
}

export default (config: AeroSandboxTypes.config) => {
	// Dangerous; setting defaults
	config.redirectors ??= true;
	config.concealers ??= true;
	config.htmlInterception ?? true;
	config.serverParamsPassthrough ??= true;

	// Safety
	config = Object.seal(structuredClone(config));

	// TODO: Import the folders in order
	importAll(require.context(`./src`, true, /\.ts$/));
	// TODO: Make this work with the new proxy middleware standard
	//this.importAll(require.context(`../middleware`, true, /inject.(\.js|\.ts)/));
};
