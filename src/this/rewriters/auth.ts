// Incomplete

// www-authenticate
function rewriteAuthServer(val, proxyUrl: URL) {
	// TODO: Support
	return val.split(",").map(dir => {
		if (dir === "") return dir;
	});
}

// authentication
function rewriteAuthClient(val, proxyUrl: URL) {
	// TODO: Support
}

export { rewriteAuthServer, rewriteAuthClient };
