import * as config from "$aero/config";
import { AeroGelConfig, ASTRewriterConfig } from "$aero/types";
/**
 * @warning AeroGel is unstable due to its parsing unless it is in a module script where parsing isn't needed
 */

interface AeroJSParserConfig {
	/** EST parsing recommended */
	modeDefault: rewriterMode;
	/** AeroGel recommended */
	modeModule: rewriterMode;
	modeConfigs: {
		aeroGel: AeroGelConfig;
		ast: ASTRewriterConfig;
	};
}

export default class JSRewriter {
	config: AeroJSParserConfig;
	constructor(config: AeroJSParserConfig) {
		this.config = config;
	}
	applyNewConfig(config: AeroJSParserConfig) {
		this.config = config;
	}
	rewriteScript(script: string): string {
		// TODO: rewrite with the proper rewriter...
		return script;
	}
}
