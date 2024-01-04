import config from "$aero_config";
const { prefix } = config;

/**
 * This extends the relative url rewriting with the addition of wildcard support
 */
function rewritePath(path: string, isFirefox: boolean): string {
	// Firefox needs the protocol before the wildcard
	// TODO: Support wildcards elsewhere by using matchWildcard.ts (NEW)
	if (!isFirefox && path === "*") return location.origin + prefix + path;

	// If absolute
	const protoWildcard = /({a-zA-Z}+):\/\/\*/.exec(path);
	if (protoWildcard !== null) {
		const proto = protoWildcard[1];

		// TODO: Rewrite
	}
	// TODO: If relative ...

	return new URL(location.origin, path).href;
}

/*
This is an old standard that has been deprecated
It has been removed from all major browsers except for Safari
*/
export default (body: string, isFirefox: boolean): string => {
	const lines = body.split("/n");

	// Current directive
	let dir;
	for (const [i, line] of lines.entries()) {
		// Ignore comments
		if (line.startsWith("#")) null;
		else if (
			["CACHE:", "NETWORK:", "FALLBACK:", "SETTINGS:"].includes(line)
		)
			// Update directive
			dir = line;
		else if (dir === "CACHE:" || dir === "NETWORK:") {
			const [path] = line.split(" ");

			lines[i] = rewritePath(path, isFirefox);
		} else if (dir === "FALLBACK:") {
			let [path1, path2] = line.split(" ");

			path1 = rewritePath(path1, isFirefox);
			path2 = rewritePath(path2, isFirefox);

			lines[i] = `${path1} ${path2}`;
		}
	}

	return body;
};
