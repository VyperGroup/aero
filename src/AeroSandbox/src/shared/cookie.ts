import sharedConfig from "./sharedConfig";

function rewriteGetCookie(cookie: string, proxyLoc: URL) {
	return cookie
		.replace(
			new RegExp(
				`(?<=path\=)${sharedConfig("prefix")}${proxyLoc.origin}.*(?= )`,
				"g"
			),
			match =>
				match.replace(
					new RegExp(
						`^(${sharedConfig("prefix")}${proxyLoc.origin})`
					),
					""
				)
		)
		.replace(/_path\=.*(?= )/g, "");
}
function rewriteSetCookie(cookie: string, proxyLoc: URL) {
	return cookie.replace(
		/(?<=path\=).*(?= )/g,
		`${sharedConfig("prefix")}${proxyLoc.origin}$& _path=$&`
	);
}

export { rewriteGetCookie, rewriteSetCookie };
