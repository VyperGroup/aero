/**
 * Rewrites a path specifically for CacheManifest files in proxies
 *
 * @param path - The path within the CacheManifest file to rewrite.
 * @param isFirefox - Whether the browser is Firefox, to handle a quirk.
 * @returns The proxied path
 */
function rewritePath(path: string, isFirefox: boolean): string {
	// Firefox needs the protocol before the wildcard
	if (!isFirefox && path === "*") {
		return `${location.origin}${self.config.prefix}${path}`;
	}

	// Handle absolute paths with wildcards
	const protoWildcard = /({a-zA-Z}+):\/\/\*/.exec(path);
	if (protoWildcard !== null) {
		const proto = protoWildcard[1];
		// Rewrite absolute path with wildcard:
		// - Append prefix if not already present
		// - Ensure trailing slash for directory matching
		return path.endsWith("/")
			? `${proto}://${location.hostname}${prefix}${path}`
			: `${proto}://${location.hostname}${prefix}${path}/`;
	}

	// Handle relative paths (including those with wildcards)
	// Rewrite relative path with wildcard:
	// - Prepend prefix for matching within the app's scope
	const relativePathWithWildcard = /^\/.*\*$/.test(path);
	if (relativePathWithWildcard) {
		return `${prefix}${path}`;
	}

	// If no wildcards or special handling required, use URL constructor
	return new URL(path, location.origin).href;
}

/**
 * Rewrites the Cache Manifest in proxies
 *
 * @param body - The Cache Manifest to rewrite.
 * @param isFirefox - Whether the browser is Firefox.
 * @returns The rewrote Cache Manifest.
 */
export default (body: string, isFirefox: boolean): string => {
	const lines = body.split(/\r?\n/); // Handle different newline characters

	let currentDirective = "";
	for (const [i, line] of lines.entries()) {
		if (line.startsWith("#")) {
			// Ignore comments
		} else if (
			["CACHE:", "NETWORK:", "FALLBACK:", "SETTINGS:"].includes(line)
		) {
			currentDirective = line;
		} else if (
			currentDirective === "CACHE:" ||
			currentDirective === "NETWORK:"
		) {
			const [path] = line.split(" ");
			lines[i] = rewritePath(path, isFirefox);
		} else if (currentDirective === "FALLBACK:") {
			const [path1, path2] = line.split(" ");
			lines[i] = `${rewritePath(path1, isFirefox)} ${rewritePath(
				path2,
				isFirefox
			)}`;
		}
	}

	return lines.join("\n");
};
