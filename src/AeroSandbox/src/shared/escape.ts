import { proxyLocation } from "$shared/proxyLocation";

/** Escapes a string with underscores. */
export default function (str: string, origin = ""): RegExp {
	return RegExp(`^(?:${origin}_+)?${str}$`, "g");
}

/**
 * Escape a string with an origin in the prefix; useful for isolation.
 * @param origin Defaults to the current proxy origin.
 * */
function escapeWithOrigin(
	str: string,
	origin = proxyLocation().origin
): string {
	return `${origin}_${str}`;
}

// biome-ignore lint/suspicious/noExplicitAny: for (is generic)
/**
 *  lass member key escaping is for when you want to proxify a class and you want to do something depending on what the constructor is, but you can't determine how the class was constructed earlier. A good example of this is in `xhr.ts` how the XHR methods work should behave differently if sync is enabled, which the browser knows when they process the XHR, but it isn't publicly visible through the XHR class itself.
 */
export function createEscapePropGetHandler(): ProxyHandler<any> {
	/**
	 * @param - The properties to trap and escape
	 */
	// @ts-ignore
	return (escapedProps: []) =>
		({
			// Unescape
			get(target, prop) {
				const stringProp = String(prop);
				if (escapedProps.includes(stringProp))
					return unescape(target, prop);

				return Reflect.get(target, prop);
			},
			// Escape
			set(target, prop) {
				const stringProp = String(prop);
				return escapedProps.includes(stringProp)
					? escape(target, prop)
					: Reflect.set(target, prop);
			}
			// biome-ignore lint/suspicious/noExplicitAny: for flexibility (is generic)
		}) as ProxyHandler<any>;
}

interface EscapeWithKeywordOptions {
	keyword: string;
	/** The maximum depth of keywords to exceed. I haven't found a use for this yet, but it is here if you need it */
	maxDepth?: number;
	/** The maximum depth of chars to exceed (the number of characters behind the original string). I haven't found a use for this yet, but it is here if you need it */
	maxDepthChars: number;
}

/**
 * Escape the string with the given keyword
 */
export function escape(
	prop: string,
	target: any,
	escapeOptions: EscapeWithKeywordOptions
) {
	const { keyword, maxDepth, maxDepthChars } = escapeOptions; // TODO: Implement max depth support
	// TODO: Implement
	if (!ESCAPE_METHOD) {
		$aero.logger.fatalErr(
			"Missing the feature flag: ESCAPE_METHOD. Unable to determine how the properties should be escaped."
		);
	}
	if (ESCAPE_METHOD === "RegExp") {
		// TODO: Implement
		$aero.logger.fatalErr(
			'The ESCAPE_METHOD "Regexp" is a STUB, so please set it to JS instead'
		);
	}
	if (ESCAPE_KEYWORD === "JS") {
		// Until we find a suitable string
		for (let currentDepth = 1; ; currentDepth++) {
			const newStrAttempt =
				target[
					// TODO: Actually make this a config option
					$aero.config.sandbox.classMemberEscapeKeyword.repeat(
						currentDepth
					) + stringProp
				];
			const newStrIsUnique = !(newStrAttempt in target);
			if (newStrIsUnique) {
				return newStrAttempt;
			}
		}
	}
}

/**
 * Unescape string with the given keyword
 */
export function unescape(str: string) {
	const { keyword, maxDepth, maxDepthChars } = escapeOptions; // TODO: Implement max depth support
	if (!ESCAPE_METHOD) {
		$aero.logger.fatalErr(
			"Missing the feature flag: ESCAPE_METHOD. Unable to determine how the properties should be unescaped."
		);
	}
	if (ESCAPE_METHOD === "RegExp") {
		// TODO: Implement
		$aero.logger.fatalErr(
			'The ESCAPE_METHOD "Regexp" is a STUB, so please set it to JS instead'
		);
	}
	if (ESCAPE_METHOD === "JS") {
		const propSplitByEscapeKeyword = stringProp.split(
			$aero.config.sandbox.classMemberEscapeKeyword
		);
		return propSplitByEscapeKeyword.shift();
	}
}
