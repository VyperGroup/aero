import type { AeroSandboxLogger } from "$aero/src/shared/Loggers";
import type { BareTransport } from "@mercuryworkshop/bare-mux";

interface AeroGlobalType {
  $sec: {
    csp: string;
    init: string;
  };
  $bc: BareClient;
  logger: AeroSandboxLogger;
}

declare global {
  // biome-ignore lint/style/noVar: <explanation>
  var $aero: AeroGlobalType;
}
