import { IBrowser } from "ua-parser-js";

import caniuse from "caniuse-api";

export default class IsNotSupported {
	private browserInfo: IBrowser;

	constructor(browserInfo: IBrowser) {
		this.browserInfo = browserInfo;
	}

	check(feature: string) {
		return !caniuse.isSupported(
			feature,
			`${this.browserInfo.name} ${this.browserInfo.version}`,
		);
	}
}
