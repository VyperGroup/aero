import scope from "./scope";
import meta from "./meta";

// TODO: Don't replace if in a block scope
const isStrict = /\s*("use strict"|'use strict');?/;

export default (script: string, isMod = false, ins = "") => {
	const lines = scope(script).split("\n");

	let [first] = lines;

	const _meta = isMod ? meta : "";

	lines[0] = isStrict.test(first)
		? first.replace(isStrict, `$1;\n${ins}\n${_meta}`)
		: ins + _meta + first;

	return lines.join("\n");
};
