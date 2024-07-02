// www-authenticate
function rewriteAuthServer(val, proxyUrl: URL) {
	return val
		.split(",")
		.map(dir => {
			const domainMatch = dir.match(/domain="(.*)"/g);
			// TODO: Rewrite
			if (domainMatch !== null) return dir;
		})
		.join(",");
}

// authentication
function rewriteAuthClient(val, proxyUrl: URL) {
	// TODO: Support
	return val
		.split(",")
		.map(dir => {
			if (dir === "domain") return dir;
		})
		.join(",");
}

export { rewriteAuthServer, rewriteAuthClient };
