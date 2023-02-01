export default {
	// Used by both the inject code and this service worker
	shared: ["cookie", "scope", "src"],
	"browser/rewriters": ["cors", "cloner", "htmlSrc", "html"],
	// API interceptors
	"browser/apis": [
		// Dependencies
		"location",
		// Misc
		"cookie",
		"navigator",
		"popup",
		"portal",
		"push",
		"reporting",
		"scoping",
		"storage",
		"workers",
		// Concealers
		"history",
		"element",
		"error",
		"messages",
		"navigation",
		"payment",
		"presentation",
		"speech",
		// Alt protocols
		"ws",
		"wrtc",
	],
	// Miscellaneous injected code
	"browser/injects": ["dom"],
};
