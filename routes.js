export default {
	// Used by both the inject code and this service worker
	"rewriters/shared": ["cookie", "scope", "src"],
	"rewriters/browser": ["cors", "cloner", "htmlSrc", "html"],
	// API interceptors
	apis: [
		// Concealers
		"location",
		"history",
		"element",
		"error",
		"messages",
		"navigation",
		// Misc
		"cookie",
		"navigator",
		"popup",
		"reporting",
		"scoping",
		"storage",
		"workers",
		// Alt protocols
		"ws",
		"wrtc",
	],
	// Miscellaneous injected code
	injects: ["dom"],
};
