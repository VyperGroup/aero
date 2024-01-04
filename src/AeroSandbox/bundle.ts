import createAeroSandboxBundle from "$aero_browser/createAeroSandboxBundle";

import rewriteScript from "$aero_browser/shared/JS/script.ts";

// TODO: Make it so that when an API through conditionals in aero's config, it would automatically be tree-shakable
// TODO: Import afterPrefix (it is defined as a eval string inside of handle.ts). I might have the make the original reference in handle.ts a function that has .toString() called on it.
createAeroSandboxBundle({
	// TODO: Remove imports for proxy location and replace proxyLocation to be $aero.proxyLocation()
	proxyLocation: () => new URL(afterPrefix(location.href)),
	jsRewriter: rewriteScript,
});
