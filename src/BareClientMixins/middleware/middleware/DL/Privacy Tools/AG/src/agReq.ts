import { Request, RequestType } from "@adguard/tsurlfilter/*";

import agLists from "./agLists";

export default (proxyUrl: URL, destination: string): Request | null => {
	let agReq;
	if (agLists.length > 0) {
		agReq = new Request(
			proxyUrl.href,
			null,
			RequestType[destination] ?? RequestType.Document,
		);
		return agReq;
	}
	return null;
};
