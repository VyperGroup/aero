import locationProxy from "browser/misc/proxyLocation";

$location = locationProxy;
$location["Symbol.toStringTag"] = "Location";

Object.defineProperty(document, "domain", {
	get: () => $location.hostname,
});
Object.defineProperty(document, "URL", {
	get: () => $location.href,
});
