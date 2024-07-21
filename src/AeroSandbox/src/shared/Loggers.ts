type htmlTemplatingCallback = (errStr: string) => string;

const aeroBubbleStyle = genBubbleStyle("#0badfb");
const fatalErrBubbleStyle = genBubbleStyle("#db3631");

// TODO: Support optionalSecondaryBubble after the branding and in the color green :)
class GenericLogger {
	log(branding: string, msg: string, optionalSeconaryBubble: string): void {
		console.log(`%c${branding}%c ` + msg, `${aeroBubbleStyle}`, "");
	}
	warn(branding: string, msg: string, optionalSeconaryBubble: string): void {
		console.warn(`%c${branding}%c ` + msg, `${aeroBubbleStyle}`, "");
	}
	error(branding: string, msg: string, optionalSeconaryBubble: string): void {
		console.error(`%c${branding}%c ` + msg, `${aeroBubbleStyle}`, "");
	}
	fatalErr(
		branding: string,
		msg: string,
	): void {
		console.error(
			`%c${branding}%c ` + msg,
			"%cfatal%c " + msg,
			`${aeroBubbleStyle}`,
			`${fatalErrBubbleStyle}`,
			""
		);
	}
}

class AeroLogger extends GenericLogger {
	log(msg: string): void {
		super.log("aero SW", msg);
	}
	warn(msg: string): void {
		super.warn("aero SW", msg);
	}
	error(msg: string): void {
		super.error("aero SW", msg);
	}
	fatalErr(
		branding: string,
		msg: string
	): void {
		super.fatalErr("aero", msg);
	}
}

enum AeroSandboxLoggerTypes {
	ApiInterceptor,
}

// TODO: Support the seconary bubbling
class AeroSandboxLogger extends GenericLogger {
	options: {
		htmlTemplatingCallback?: htmlTemplatingCallback
	}

	constructor(options) {
		super();
		options = options;
	}

	log(
		msg: string,
		options?: {
			type: AeroSandboxLoggerTypes;
			name: string;
		}
	): void {
		super.log("aero sandbox", msg);
	}
	warn(
		msg: string,
		options?: {
			type: AeroSandboxLoggerTypes;
			name: string;
		}
	): void {
		super.warn("aero sandbox", msg);
	}
	error(
		msg: string,
		options?: {
			type: AeroSandboxLoggerTypes;
			name: string;
		}
	): void {
		super.error("aero sandbox", msg);
	}
	fatalErr(
		branding: string,
		msg: string
		options?: {
			type: AeroSandboxLoggerTypes;
			name: string;
		}
	): void {
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
