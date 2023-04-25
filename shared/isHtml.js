// For the SW
if (typeof $aero === "undefined") var $aero = {};

$aero.isHtml = type =>
	type.startsWith("text/html") || type.startsWith("application/xhtml+xml");

export default $aero.isHtml;
