import { ResponseContext } from "mw";
import { Rewriters } from "mwRewriters";

import UAParser, { IBrowser } from "ua-parser-js";
import getBrowserInfo from "./lib/getBrowserInfo";

import { transformAsync } from "@babel/standalone";

const rewriters: Rewriters = {
	css: async (styles: string) => {
		return styles;
	},
	jsExternal: async (script: string, ctx: ResponseContext) => {
		if (ctx.resp.headers.has("user-agent"))
			return transformJS(
				script,
				new UAParser(ctx.resp.headers.get("user-agent")).getBrowser(),
			);
	},
	jsInline: async (script: string) => transformJS(script, getBrowserInfo()),
};

function transformJS(script: string, browserInfo: IBrowser): string {
	let targets = {};

	targets[browserInfo.name] = browserInfo.version;

	const transformedScript = transformAsync(script, {
		presets: ["@babel/preset-env"],
		targets,
	});

	// TODO: ...

	// Placeholder
	return transformedScript;
}

export default rewriters;
