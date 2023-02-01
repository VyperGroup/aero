// For module scripts
if (typeof $aero === "undefined") var $aero = {};

function rewriteGetCookie(prefix, cookie) {
	return (
		cookie
			// Not done yet
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
function rewriteSetCookie(prefix, cookie) {
	console.log(cookie);
	return cookie.replace(
		/(?<=path\=).*(?= )/g,
		`${$aero.config.prefix}${$aero.location.origin}$& _path=$&`
	);
}

$aero.rewriteGetCookie = rewriteGetCookie;
$aero.rewriteSetCookie = rewriteSetCookie;

export { rewriteGetCookie, rewriteSetCookie };
