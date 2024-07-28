import type { AeroSandboxLogger } from "$shared/Loggers";
import type BareClient from "@mercuryworkshop/bare-mux";

import { Config } from "./config";

export interface AeroGlobalType {
	init: string;
	sec: {
		csp: string;
	};
	bc: BareClient;
	logger: AeroSandboxLogger;
	config: Config;
}

declare global {
	// biome-ignore lint/style/noVar: <explanation>
	var $aero: AeroGlobalType;
}
