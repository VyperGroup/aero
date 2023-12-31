import { flags } from "$aero_config";

import * as config from "$aero_config";

// Somehow make scope global in browser bundle
const scope = (script: string): string => {
	return script;
	/*
	// Currently scanning for
	const scan = {
		brackets: false,
		slComment: false,
		dlComment: false,
		quotes: [
			{
				char: '"',
			},
			{
				char: "'",
			},
			{
				char: "`",
			},
		],
		repls: [
			{
				str: "location",
			},
			{
				// Conceal namespace
				str: "$aero",
			},
		],
	};
	const init = repl => {
		repl.searching = false;

		return repl;
	};
	scan.repls = scan.repls.map(init);
	scan.quotes = scan.quotes.map(init);

	if (config.debug.scoping) {
		let locNum = 1;
		console.groupCollapsed(group(locNum));
	}
	let i = 0;
	while (i < script.length - 1) {
		const prevChar = script[i - 1];
		const char = script[i];
		const nextChar = script[i + 1];

		const quote = scan.quotes.find(quote => quote.char.startsWith(char));
		//const tl = scan.quotes.find(quote => quote.startsWith("`"));

		if (scan.slComment && char === "\n") scan.slComment = false;
		else if (char === "/" && nextChar === "/") scan.slComment = true;
		else if (scan.dlComment && char === "*" && nextChar === "/")
			scan.dlComment = false;
		else if (char === "/" && nextChar === "*") scan.dlComment = true;
		else if (
			// Not escaped
			prevChar !== "\\" &&
			quote
		) {
			// Reset
			if (quote.searching) {
				quote.searching = false;
			} else quote.searching = true;
		} /* else if (
			tl.length > 0 &&
			script[i - 2] === "\\" &&
			prevChar === "$" &&
			char === "{"
		) {
			// TODO: Implement Exp recursion
			tl.find(tl => tl.insideExp === false).insideExp = true;

			continue;
		} *\/
		// Ignore quotes
		else if (scan.quotes.find(quote => quote.searching));
		else {
			scan.repls.map(repl => {
				function reset() {
					repl.searching = true;
					repl.pos = i;
					repl.wordPos = 0;
				}

				if (repl.searching) {
					if (
						// Ensure it isn't simply a part of another variable name
						// Correct so far
						char === repl.str.charAt(repl.wordPos)
						/*
						&&
						// Char before
						!isValidVarChar(script[repl.pos - 1])
						*\/
					) {
						if (repl.wordPos === 0) repl.pos = i;

						const foundYet = repl.wordPos === repl.str.length - 1;

						if (config.debug.scoping)
							console.log(
								`In: ${repl.str}\nChar: ${char}\nChar Pos: ${repl.wordPos}\nReal Pos: ${repl.pos}\nIndex: ${i}\nFound yet: ${foundYet}`
							);

						if (foundYet) {
							if (config.debug.scoping) {
								console.groupEnd();
								console.groupCollapsed(group(locNum++));
							}

							if (
								flags.concealNamespace &&
								repl.str === "$aero"
							) {
								({ i, script } = replace(
									repl.pos,
									i + 1,
									script,
									() => "_$aero"
								));

								reset();
							} else if (shouldCheck(i, script)) {
								({ i, script } = replace(
									repl.pos,
									i + 1,
									script,
									() => `$aero.check(${repl.str})`
								));

								reset();
							}
						} else repl.wordPos++;
					} else {
						reset();
						repl.pos++;
					}
				} else {
					reset();
				}

				return repl;
			});
		}
		i++;
	}
	if (config.debug.scoping) console.groupEnd();

	return script;
	*/
};

/*
function group(n) {
	return `Loc #${n}`;
}

/**
 * If the variable should be checked
 * @param - Ending position
 * @param - Context string
 * @returns
 *\/
function shouldCheck(ep: number, str: string) : boolean {
	return notDestructure(ep, str) && notInsideFunc(ep, str);
}

/**
 * Ensure that the variable simply isn't a part of a destructure
 * @param - Ending position
 * @param - Context string
 * @returns 
 *\/
function notDestructure(ep: number, str: string) : boolean {
	for (let i = ep + 1; i > str.length; i++) {
		if (str === " ") continue;
		else if (str === "=") return false;
		else break;
	}

	return true;
}

/**
 *
 * @param - Ending position
 * @param - Context string
 * @returns 
 *\/
function notInsideFunc(eP: number, str: string) : boolean {
	return true;

	const endParen = str[eP + 1] === ")";

	for (let i = eP + 2; i > str.length - 1; i++)
		// Block
		if (str[i] === "{") return false;
		// Arrow
		else if (str[i] === "=" && str[i + 1] === "=>") return false;
		// Ignore whitespace
		else if (str === " ") continue;
		else break;

	return true;
}

/**
 *
 * @param - Starting position
 * @param - Ending position
 * @param - Context string
 * @param - Replacement function
 * @returns Replaced data
 *\/
function replace(sP: number, eP: number, str: string, func: Function) : object {
	// sP = getContextOfProp(sP, str);

	const match = str.substring(sP, eP);

	let newStr = func(match);

	return {
		script: str.slice(0, sP) + newStr + str.substring(eP),
		// Used to offset the index to reflect the replacement
		i: sP + newStr.length,
	};
}

/**
 * Get everything to check before the actual variable name itself, in the case of a property
 * @param - Starting position
 * @param - Context string
 * @returns  The index of which the context starts
 *\/
function getContextOfProp(sP: number, str: string, i: number) {
	// Backtrack index
	for (i = sP - 1; i >= 0; i++) {
		const char = str[i];
		if (
			!(
				isValidVarChar(char) ||
				char === "." ||
				(char === ")" &&
					(() => {
						// TODO: Allow/skip anything inside of parentheses

						return false;
					})())
			)
		)
			break;
	}

	return i;
}

/**
 * @returns If the character can be a part of a proper variable name
 *\/
function isValidVarChar(char: string) : boolean {
	return (
		(char >= "A" && char <= "Z") ||
		(char >= "a" && char <= "z") ||
		char === "_" ||
		char === "$"
	);
}
*/

export default scope;
