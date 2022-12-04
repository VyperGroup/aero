// Module only
import * as config from "../../config.js";

if (typeof $aero === "undefined")
	var $aero = {
		config: config,
	};

/**
 * Deep property check scoping
 * @param {string} script - The script to be rewritten
 * @return {string} - The rewritten script
 */
$aero.scope = script => {
	// Operators
	const ops = "`|\\?|\\:|;|=|,|\\|\\||&&";

	const startVar = " |\\n|\\(|\\[|\\:" + ops;
	const endVar = " |\\n|\\)|\\]" + ops;

	const notInit = "(?<!var\\s*|let\\s*|const\\s*|new\\s*)";

	const notSurrounded = (char, str) =>
		`(?!\\B${char}[^${char}]*)${str}(?![^${char}]*${char}\\B)`;
	const excludeStrs = str => str;
	//const excludeStrs = str => notSurrounded("`", notSurrounded("'", notSurrounded('"', str)));

	const hide = src =>
		src.replace(
			new RegExp(excludeStrs(`(?<=(${startVar}))$aero.+(${endVar})`)),
			"$1undefined$2"
		);

	const blockedList = "[a-zA-Z0-9\\,\\.\\-\\:_]";
	const blockedListEnd = "[a-zA-Z0-9\\,\\.\\-\\:_]";

	const varCalled = str =>
		`${notInit}(?<!${blockedList})` + str + `(?!${blockedListEnd})`;

	let rewrittenScript = hide(script)
		.replace(
			new RegExp(excludeStrs(varCalled("location")), "g"),
			// In case a function overwritten the value of location in its parameters
			"(location === window.location ? $aero.location : location)"
		)
		.replace(
			new RegExp(excludeStrs(varCalled("window\\.location")), "g"),
			"$aero.location"
		)
		.replace(
			new RegExp(excludeStrs(varCalled("document\\.location")), "g"),
			"$aero.location"
		)
		.replace(
			new RegExp(excludeStrs(varCalled("document\\.domain")), "g"),
			"$aero.document.domain"
		)
		.replace(
			new RegExp(excludeStrs(varCalled("document\\.URL")), "g"),
			"$aero.document.URL"
		)
		.replace(new RegExp(excludeStrs(varCalled("eval")), "g"), "$aero.eval")
		.replace(
			new RegExp(
				excludeStrs(
					`(${startVar})${notInit}([^${startVar}${endVar}]+)(?<!\\$aero)\\.location(\\.?)(?<!${blockedList})`
				),
				"g"
			),
			// Put this back into a string
			(match, p1, p2, p3) =>
				`${p1}$aero.check.window(${p2}.location)${p3}`
		);
		/*
		.replace(
			// \[([^\[\]]*)\]
			new RegExp(
				excludeStrs("( |\\n|\\()([^\\[\\]]+)\\[([^\\[\\]]+)\\]", "g")
			),
			"$1$2[$aero.check.location($3)]"
		);
		*/

	if ($aero.config.debug.scoping)
		console.log(`Scoping script\n${script}\n->\n${rewrittenScript}`);

	return rewrittenScript;
};

export default $aero.scope;
