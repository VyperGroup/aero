import { prefix } from "../config.js";

// For module scripts
if (typeof $aero === "undefined")
	var $aero = {
		config: {
			prefix: prefix,
		},
	};

function rewriteGetCookie(cookie) {
	return (
		cookie
			// TODO: Finish getter
			.replace(
				new RegExp(
					`(?<=path\=)${$aero.config.prefix}${$aero.location.origin}.*(?= )`,
					"g"
				),
				match => null
			)
			.replace(/_path\=.*(?= )/g, "")
	);
}
function rewriteSetCookie(cookie) {
	return cookie.replace(
		/(?<=path\=).*(?= )/g,
		`${$aero.config.prefix}${$aero.location.origin}$& _path=$&`
	);
}

$aero.rewriteGetCookie = rewriteGetCookie;
$aero.rewriteSetCookie = rewriteSetCookie;

export { rewriteGetCookie, rewriteSetCookie };
