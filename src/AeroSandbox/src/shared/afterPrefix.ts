import config from "../../../config";
const { prefix } = config;

// TODO: Rename this to getProxyURLFromRealURL
/*
Separate the prefix from the url to get the proxy url isolated
This is primarily used for concealers
*/
export default (rawURL: string) =>
	rawURL.replace(new RegExp(`^(${location.origin}${prefix})`, "g"), "");
