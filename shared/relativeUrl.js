// For the SW
if (typeof $aero === "undefined")
	var $aero = {
		proxyLocation: {
			href: null,
		},
	};

// Convert relative URLs to absolute urls
$aero.processRelativeUrl = (url, loc = $aero.proxyLocation.href) =>
	new URL(loc, url);

export default $aero.processRelativeUrl;
