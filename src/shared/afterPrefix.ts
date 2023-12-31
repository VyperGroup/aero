import { prefix } from "$aero_config";

/*
Separate the prefix from the url to get the proxy url isolated
This is primarily used for concealers
*/
export default (url: string) =>
	url.replace(new RegExp(`^(${location.origin}${prefix})`, "g"), "");
