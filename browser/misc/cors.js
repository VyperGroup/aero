$aero.cors.csp = $aero.cors.headers.csp;
if ($aero.cors.clear)
	$aero.cors.clear = JSON.parse(`[${$aero.cors.headers.clear}]`);
// TODO: Parse
$aero.cors.perms = null;
