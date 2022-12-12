// Module only
import * as config from "../../config.js";

if (typeof $aero === "undefined")
	var $aero = {
		config: config,
	};

/**
 * Deep property check scoping
 * @param {string} The script to be rewritten
 * @return {string} The rewritten script
 */
$aero.scope = script => {
	const hide = src => src;

	const sur = v => new RegExp(`(?<!\\.|_|[a-zA-Z])${v}(?!:|=|_|[a-zA-Z])`);

	let rewrittenScript = hide(script)
		.replace(sur("document\\.domain"), "$aero.document.domain")
		.replace(sur("document\\.url"), "$aero.document.URL")
		.replace(
			sur("location"),
			// Ensure that the location in the current scope wasn't overwritten
			`($aero.isLocation(location) ? $aero.location : location)`
		)
		.replace(sur("eval"), "$aero.eval")
		.replace(
			/(:?[^\\]|^)((:?\\\\)*\"(:?.*?[^\\]){0,1}(:?\\\\)*\")|(:?[^\\]|^)((:?\\\\)*\'(:?.*?[^\\]){0,1}(:?\\\\)*\')|(:?[^\\]|^)((:?\\\\)*\/(:?.*?[^\\]){0,1}(:?\\\\)*\/)|(,|,\s+|=|=\s+|var|var\s+|let|let\s+|const|const\s+)?(\[[^\][]*])(\s+,|,|\)|\s+\))?/g,
			(
				m,
				g1,
				g2,
				g3,
				g4,
				g5,
				g6,
				g7,
				g8,
				g9,
				g10,
				g11,
				g12,
				g13,
				g14,
				g15,
				g16,
				g17,
				g18
			) => {
				/*
				Return original match
					g1-g5 - Double quotes
					g5-g10 - Single quotes
					g10-g15 - Regex slash
					g16 - Common patterns that if matched, show that the array is for destructuring and shall not be rewritten. The comma pattern is an exception and if the brackets end with a another comma or brackets then it is rewritten; this is because commas can be used for both function parameters and array destructuring, which will be mentioned in g18! 
				
				Rewrite
					g17 - The brackets to be replaced
					g18 - Matches comments and brakets to confirm that the match isn't in a destructure scenario
				*/

				if (
					((typeof g16 !== "undefined" &&
						g16.startsWith(",") &&
						typeof g18 !== undefined) ||
						typeof g16 === "undefined") &&
					// Ensure that the brackets have been matched
					typeof g17 !== "undefined" &&
					// Ensure that the specificed match is the brackets match. While this check may look redundant
					m.startsWith("[") &&
					m.endsWith("]")
				) {
					const rewrite = `[$aero.check(${g17.slice(1, -1)})]`;

					if ($aero.config.debug.scoping)
						console.log(`Check ${m} -> ${rewrite}`);

					return rewrite;
				} else return m;
			}
		);

	if ($aero.config.debug.scoping)
		console.log(`Scoping script\n${script}\n->\n${rewrittenScript}`);

	return rewrittenScript;
};

export default $aero.scope;
