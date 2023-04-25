export default {
	// Used by both the inject code and this service worker
	shared: ["meta", "isHtml", "cookie", "scope", "script", "src"],
	"browser/misc": [
		"escape",
		"proto",
		"storage",
		// CORS Emulation
		"frame",
		"policy",
		"perms",
		"clear",
	],
	"browser/rewriters": ["tt", "csp", "cloner", "htmlSrc", "html"],
	// Hide the true origin
	"browser/api/concealer": [
		"css",
		"element",
		"error",
		"event",
		"file",
		"fs",
		"manifest",
		"navigation",
		"payment",
		"presentation",
		"push",
		"reporting",
		"secure",
		"timing",
		"xml",
		"scoping",
	],
	"browser/api/event": ["messages"],
	"browser/api/loc": [
		"contentIndex",
		"history",
		"location",
		"navigator",
		"popup",
	],
	// Alt protocols
	"browser/api/req": ["http", "ws", "wrtc"],
	//"browser/api/storage": ["cookie", "idb", "sql", "storage"],
	"browser/api/worker": ["workers"],
};
