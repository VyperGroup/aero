import sharedConfig from "./sharedConfig";

// These methods allow the API Interceptors to get the proxy URL from the real URL

/*
Separate the prefix from the url to get the proxy url isolated
This is primarily used for concealers
*/
function afterPrefix(realURL: string) {
	self.logger.log(`${location.origin}${sharedConfig("prefix")}`);
	return realURL.replace(
		new RegExp(`^(${location.origin}${sharedConfig("prefix")})`, "g"),
		""
	);
}

function afterOrigin(realURL: string) {
	return realURL.replace(new RegExp(`^(${location.origin})`, "g"), "");
}

export { afterPrefix, afterOrigin };
