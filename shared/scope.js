// For the SW
import * as config from "../config.js";
if (typeof $aero === "undefined")
	var $aero = {
		config,
	};

const varC = "a-zA-Z$_";

// Ignore strings and RegExps
const divC = String.raw`[a-zA-Z\d]`;
const esc = String.raw`(?<!\\)(\\\\)`;
const ignoreStrings = [
	// Division operations; used to differentiate from RegExp
	//String.raw`[${divC}\s*\/\s*${divC}`,
	// RegExp
	String.raw`([\/])(?!\s*${divC}).*?${esc}*\1`,
	// Quotes
	String.raw`(["'\/]).*?${esc}*\3`,
	// FIXME: Causes "Catastrophic Backticking"
	//String.raw`([\`]).*?${esc}*\5`,
];
const ignoreComments = [
	String.raw`^\/\/.+`,
	// FIXME: This doesn't work in some comments like in: http://letsplay.ouigo.com
	//String.raw`\/\*.*\*\/`,
];
// Location could be overwritten in location parameters
// TODO: Account for default parameters like: (ye = location.href)
const paramsMatch = String.raw`\(([^()]*)\)`;
const ignoreFuncParams = [
	String.raw`(?:[${varC}.]+)\s*=>`,
	String.raw`\((?:[${varC}.]+)\)\s*=>`,
	// FIXME: Breaks on the edge case: (x = ",") =>
	String.raw`function(?:\s+[${varC}]*\s*|)${paramsMatch}`,
	String.raw`${paramsMatch}\s*=>`,
];

const isVar = v => String.raw`(?<!\.|_|[${varC}])(${v})(?!\s*:|\s*=|[${varC}])`;
// Form regex
const r = v =>
	new RegExp(
		[
			...ignoreStrings,
			//...ignoreComments,
			...ignoreFuncParams,
			isVar(v),
		].join("|"),
		"gms"
	);
const log = (f, r, o) => console.debug(`Found: ${f} @ ${o}\nReplaced: ${r}`);
const repl = (v, m, ...rest) => {
	const a = rest.slice(0, -1);

	const o = a.pop();
	const s = a.pop();

	if (s) {
		log(m, v, o);

		return v;
	}
	return m;
};
const scope = (m, ...rest) => {
	const a = rest.slice(0, -1);

	const o = a.pop();
	const s = a.pop();

	if (s) {
		let r = `$aero.check(${m})`;

		log(m, r, o);

		return r;
	} else return m;
};

const exp = {
	// TODO: Don't let $aero precede: var, let, const
	concealNamespace: r(String.raw`\$aero"`),
	/*
	FIXME: { ..., location }
	The :{ stuff after the | is a temporary patch for Discord Login
	*/
	scope: r(
		String.raw`[${varC}.]+(?:\([${varC}.]*\))*\.location|:{(?:\s+)?location`
	),
};

console.log(exp.scope);

/**
 * Deep Property Check Scoping
 * @param {string} - The script to be rewritten
 * @return {string} - The rewritten script
 */
$aero.scope = script => {
	if ($aero.config.flags.concealNamespace)
		script = script.replace(exp.concealNamespace, function () {
			return repl("_$aero", ...arguments);
		});

	script = script.replace(exp.scope, scope);

	//console.log(script);

	return script;
};

export default $aero.scope;
