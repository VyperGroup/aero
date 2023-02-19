import { flags, debug } from "../config.js";

// For module scripts
if (typeof $aero === "undefined")
	var $aero = {
		config: {
			flags: flags,
			debug: debug,
		},
	};

/**
 * Deep property check scoping
 * @param {string} - The script to be rewritten
 * @return {string} - The rewritten script
 */
$aero.scope = script => {
	for (let _char in script) {
		// TODO: Write an alt scoping module that doesn't use regex. The current scoping solution would still be default
	}

	return script;
};

export default $aero.scope;
