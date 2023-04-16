$aero.sec.csp = $aero.sec.headers.csp;
if ($aero.sec.clear)
	$aero.sec.clear = JSON.parse(`[${$aero.sec.headers.clear}]`);
// TODO: Parse and use in perms.js
$aero.sec.perms = $aero.sec.perms.split(";");
