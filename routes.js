export default {
	// Used by both the inject code and this service worker
	"rewriters/shared": ["cookie", "scope", "src"],
	"rewriters/browser": ["cors", "cloner", "htmlSrc", "html"],
	// API interceptors
	apis: [
		// Concealers
		"element",
		"error",
		// Misc
		"cookie",
		"history",
		"location",
		"messages",
		"navigator",
		"popup",
		"scoping",
		"storage",
		"workers",
		"ws",
		"wrtc",
	],
	// Miscellaneous injected code
	injects: ["dom"],
};
