import type { AeroSandboxLogger } from "$shared/Loggers";
import type BareClient from "@mercuryworkshop/bare-mux";

export interface AeroGlobalType {
  $sec: {
    csp: string;
    init: string;
  };
  $bc: BareClient;
  logger: AeroSandboxLogger;
  prefix: string;
}

declare global {
  // biome-ignore lint/style/noVar: <explanation>
  var $aero: AeroGlobalType;
}
