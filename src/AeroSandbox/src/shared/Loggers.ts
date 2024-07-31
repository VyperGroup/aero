import type { Config } from "$aero/types/config";

// @ts-ignore
declare const self: WorkerGlobalScope &
	typeof globalThis & {
		config: Config;
	};

// Webpack Feature Flags
// biome-ignore lint/style/useSingleVarDeclarator: <explanation>
let DEBUG: boolean;

type htmlTemplatingCallbackType = (errStr: string) => string;

const aeroBubbleStyle = genBubbleStyle("#0badfb");
const fatalErrBubbleStyle = genBubbleStyle("#db3631");

// TODO: Support optionalSecondaryBubble after the branding and in the color green :)
class GenericLogger {
	log(branding: string, msg: string, optionalSeconaryBubble?: string): void {
		console.log(`%c${branding}%c ${msg}`, `${aeroBubbleStyle}`, "");
	}
	warn(branding: string, msg: string, optionalSeconaryBubble?: string): void {
		console.warn(`%c${branding}%c ${msg}`, `${aeroBubbleStyle}`, "");
	}
	debug(
		branding: string,
		msg: string,
		optionalSecondaryBubble?: string
	): void {
		if (DEBUG) {
			console.debug(`%c${branding}%c ${msg}`, `${aeroBubbleStyle}`, "");
		}
	}
	error(
		branding: string,
		msg: string,
		optionalSeconaryBubble?: string
	): void {
		console.error(`%c${branding}%c ${msg}`, `${aeroBubbleStyle}`, "");
	}
	fatalErr(branding: string, msg: string): void {
		console.error(
			`%c${branding}%c ${msg}`,
			`%cfatal%c ${msg}`,
			`${aeroBubbleStyle}`,
			`${fatalErrBubbleStyle}`
		);
	}
}

interface LoggerOptions {
	htmlTemplatingCallback?: htmlTemplatingCallbackType;
}

class AeroLogger extends GenericLogger {
	options: LoggerOptions;

	constructor(options?: LoggerOptions) {
		super();
		if (options) this.options = options;
	}

	log(msg: string): void {
		super.log("aero SW", msg);
	}
	warn(msg: string): void {
		super.warn("aero SW", msg);
	}
	debug(msg: string): void {
		super.warn("aero SW", msg);
	}
	error(msg: string): void {
		super.error("aero SW", msg);
	}
	fatalErr(msg: string): /* Response */ Error {
		super.fatalErr("aero SW", msg);
		return new Error(`Caught Fatal Error: ${msg}`);
		/*
		return new Response(
			/*
			// TODO: Fix
			this.options && "htmlTemplatingCallback" in this.options
				? `Fatal error:	 ${msg}`
				: this.options.htmlTemplatingCallback(msg),
				*\/
			msg,
			{
				status: 500,
				headers: {
					"content-type": "text/html"
				}
			}
		);
		*/
	}
}

// TODO: Support the seconary bubbling
class AeroSandboxLogger extends GenericLogger {
	options: LoggerOptions;

	constructor(options: LoggerOptions) {
		super();
		this.options = options;
	}

	log(msg: string): void {
		super.log("aero sandbox", msg);
	}
	warn(msg: string): void {
		super.warn("aero sandbox", msg);
	}
	error(msg: string): void {
		super.error("aero sandbox", msg);
	}
	fatalErr(msg: string): void {
		super.fatalErr("aero sandbox", msg);

		if (this.options.htmlTemplatingCallback !== undefined)
			this.options.htmlTemplatingCallback(msg);
	}
}

export { AeroLogger, AeroSandboxLogger };

/** For the log bubbles */
export default function genBubbleStyle(color: string): string {
	return /* css */ `
color: white;
background-color: ${color};
padding: 3px 6px 3px 6px;
border-radius: 3px; font: bold .8rem "Fira San", sans-serif;
	`;
}
