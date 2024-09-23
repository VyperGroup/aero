import type { overwriteRecordsType } from "$types/generic";

/** @warning Basic Regexp is unsupported as of now and will never be recommended */
export type rewriterMode = "aerogel" | "ast" | "basic_regexp";
export type aerogelParser = "esniff";
export type astParser = "oxc" | "seafox";
export type astWalker = "traverse_the_universe";

export interface RewriteOptions {
	/** Whether the script is a module script */
	isModule: boolean;
	/** The code to insert */
	insertCode?: string;
}
export type keywordReplacementType = {
	[key: string]: {
		keywordLen: number;
		replacementStr: string;
	};
};
export interface GenericJSParserConfig {
	/* Use null only if you don't have a proxy namespace you want to conceal */
	proxyNamespace: string | null;
	/** These must be on some sort of global object */
	objPaths: {
		proxy: {
			window: string;
			location: string;
		};
		fakeVars: {
			let: string;
			const: string;
		};
	};
}
export interface AeroGelConfig extends GenericJSParserConfig {
	/**
	 * TODO: Support the overwriteRecords instead of blindly overwriting `location` in the IIFE
	 * */
	overwriteRecords: overwriteRecordsType;
	parserConfig: {
		parser: aerogelParser;
	};
}
export interface ASTRewriterConfig extends GenericJSParserConfig {
	parserConfig: {
		parser: astParser;
	};
	walkerConfig: {
		walker: astWalker;
	};
}
export interface AeroJSParserConfig {
	proxyNamespace: string;
	/** EST parsing recommended */
	modeDefault: rewriterMode;
	/** AeroGel recommended */
	modeModule: rewriterMode;
	modeConfigs: {
		generic: GenericJSParserConfig;
	};
	/** These arrays are sorted in order of your preference */
	preferredParsers: {
		aerogel: aerogelParser[];
		ast: astParser[];
	};
	preferredASTWalkers: astWalker[];
}
