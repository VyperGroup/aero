// For the SW
import * as config from "../config.js";
if (typeof $aero === "undefined")
	var $aero = {
		config,
	};

// TODO: Conceal $aero with DPCS
/**
 * Deep Property Check Scoping
 * @param {string} - The script to be rewritten
 * @return {string} - The rewritten script
 */
$aero.scope = script => {
	return script;

	// Escapes (i means inside)
	// Quotes
	// '
	let iSQ = false;
	// "
	let iDQ = false;
	// `
	let iTQ = false;
	// Comments
	let iSLC = false;
	let iDLC = false;

	// ${...}; These need start and end since they aren't uniform
	let sT;
	// Normal start braces; This is used so we can ignore scopes which may've been confused with the end of a template quote
	let sBc = [];
	// This could contain either the closing braces of scopes or templates
	let eBc = [];
	// [...]; This is what we are looking to check
	let sBr = [];
	let eBr = [];
	// (...)
	let sP = [];
	let eP = [];

	for (var i = 0; i < script.length; i++) {
		// Previous char
		const pC = script[i - 1];
		// Current char
		const c = script[i];
		// Next char
		const nC = script[i + 1];

		// Check for string chars so that the scoper doesn't don't overwrite strings
		if (isStrChar("'", c, pC)) iSQ = !iSQ;
		else if (isStrChar('"', c, pC)) iDQ = !iDQ;
		else if (isStrChar("`", c, pC)) iTQ = !iTQ;
		else if (iTQ) {
			// Check for templates
			if (pC === "$" && c === "{") sT.push(i - 1);
			else if (c === "{") sBc = i;
			else if (c === "}") {
				eBc.push(i);

				// If the template has properly ended
				if (eBc.length === sBc.length + 1) {
					// Scope what is inside of the template
					var { i, script } = replace(
						script,
						sBc,
						eBc.at(-1),
						match => $aero.scope(match)
					);

					// Reset
					sBc = undefined;
					eBc = [];
				}
			}
		} else if (iSLC) {
			if (c === "\n") iSLC = false;
		} else if (c === "/" && nC == "/") iSLC = true;
		else if (iDLC) {
			if (c == "*" && nC === "/") iDLC = false;
		} else if (c === "/" && nC == "*") iDLC = true;
		else if (
			// Quotes
			!iSQ &&
			!iDQ &&
			!iTQ
		) {
			if (isVarChar(c)) {
				// Inside word
				const [word, sWordI] = getCurrentWordStr(script, i);

				// Don't rewrite function parameters
				let s1 = sP[0];
				let e1 = eP[eP.slice(-1)];
				if (
					!(
						// Ensure that whatever this is, it is surrounded by ()
						(
							sP.length === eP.length - 1 &&
							// Normal function
							((s1.hasFunction && e1.hasBrace && !e1.hasArrow) ||
								// Arrow Function
								(!s1.hasFunction &&
									!e1.hasBrace &&
									e1.hasArrow))
						)
					)
				) {
					if (word === "location") {
						// Ensure that the location in the current scope wasn't overwritten
						var { i, script } = replace(
							sWordI,
							i + 1,
							script,
							() =>
								"($aero.isLocation(location) ? $aero.location : location)"
						);
					} else if (
						word === "document\\.domain" ||
						word === "document\\.url"
					)
						var { i, script } = insert(script, "$aero.", sWordI);
				}
			} else if (c === "(") {
				let hasFunction = false;
				for (let j = sP; j >= 0; j--)
					// Look for the function keyword at the start of the last parentheses
					if (script[j] !== " ") {
						const [word] = getCurrentWordStr(script, i);
						if (word === "function") hasFunction = true;
					}

				sP.push({
					i,
					hasFunction,
				});
			} else if (c === ")") {
				// Arrow function after )
				let hasArrow = false;
				for (let j = i; j < script.length; j++) {
					// Look for =>
					const ch = script[j];
					if (ch !== " ")
						hasArrow = ch === "=" && script[j + 1] === ">";
				}

				// Closing function
				let hasBrace = false;
				for (let j = i; j < script.length; j++) {
					const ch = script[j];
					if (ch !== " ") hasBrace = ch === "{";
				}

				eP.push({
					i,
					hasArrow,
					hasBrace,
				});

				// Ignore
				const { hasFunction: openingHasFunction } = sP[0];
				if (
					sP.length === eP.length &&
					!hasArrow &&
					!hasBrace &&
					!openingHasFunction
				) {
					// Remove the first level
					sP.shift();
					eP.pop();
				}
			}
			// Check for brackets that are property accessors not destructors
			else if (
				c === "[" &&
				// Be able to match chained property accessors
				nC !== "]" &&
				// Ensure that the starting brace is for a property accessor by checking if an object name is given
				isVarChar(c)
			)
				sBr.push(i);
			else if (c === "]") {
				eBr.push(i);

				// The brace and its nested braces (if applicable) have been closed
				if (eBr.length === sBr.length)
					// Now it's time to scope them all
					// Go through all the pairs
					while (eBr.length >= 0) {
						// Get indices of [ and ]
						const sI = sBr.pop();
						const eI = eBr.pop();

						const [word, sWordI] = getCurrentWordStr(script, sI);

						var { i, script } = replace(
							script,
							sWordI,
							eI,
							match => `aero.scope(${word + match})`
						);
					}
			}
		}
	}

	return script;
};

// Backreferences the current char index to check what the full word is
function getCurrentWordStr(str, i) {
	let word = "";
	let sWordI = i;

	for (; i >= 0; i--) {
		const c = str[i];

		if (isVarChar(c)) word = c + word;
		else {
			// The index behind the word
			sWordI = i + 1;
			break;
		}
	}

	return [word, sWordI];
}

function replace(sI, eI, str, func) {
	const match = str.substring(sI, eI);

	let newStr = func(match);

	// Splice can't be used on strings
	return {
		script: str.slice(0, sI) + newStr + str.substring(eI),
		// Used to offset the index to reflect the replacement
		i: sI + newStr.length,
	};
}

function insert(str, add, i) {
	return {
		str: str.insert(add, i),
		i: add.length,
	};
}

function isStrChar(str, c, pC) {
	return (
		c === str &&
		// Ensure that the quote isn't a terminator
		pC !== "\\"
	);
}
// Checks if a char can be used as a variable name
function isVarChar(c) {
	return (
		(c >= "A" && c <= "Z") ||
		(c >= "a" && c <= "z") ||
		c === "_" ||
		c === "$"
	);
}

export default $aero.scope;
