// For the SW
import scope from "./scope.js";
import meta from "./meta.js";
if (typeof $aero === "undefined")
	var $aero = {
		scope,
		meta,
	};

// TODO: Don't replace if in a block scope
const isStrict = /\s*("use strict"|'use strict');?/;

$aero.rewriteScript = (script, isMod = false, ins = "") => {
	const lines = $aero.scope(script).split("\n");

	let [first] = lines;

	const _meta = isMod ? $aero.meta : "";

	lines[0] = isStrict.test(first)
		? first.replace(isStrict, `$1;\n${ins}\n${_meta}`)
		: ins + _meta + first;

	return lines.join("\n");
};

export default $aero.rewriteScript;
