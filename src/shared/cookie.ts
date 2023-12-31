import { prefix } from "$aero_config";

function rewriteGetCookie(cookie: string, proxyLoc: URL) {
	return cookie
		.replace(
			new RegExp(`(?<=path\=)${prefix}${proxyLoc.origin}.*(?= )`, "g"),
			match =>
				match.replace(new RegExp(`^(${prefix}${proxyLoc.origin})`), ""),
		)
		.replace(/_path\=.*(?= )/g, "");
}
function rewriteSetCookie(cookie: string, proxyLoc: URL) {
	return cookie.replace(
		/(?<=path\=).*(?= )/g,
		`${prefix}${proxyLoc.origin}$& _path=$&`,
	);
}

export { rewriteGetCookie, rewriteSetCookie };
