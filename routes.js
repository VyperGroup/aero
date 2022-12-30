export default {
	// Used by both the inject code and this service worker
	"rewriters/shared": ["cookie", "scope", "src"],
	"rewriters/browser": ["cors", "cloner", "html"],
	// Hooks into JS apis
	hooks: [
		"cookie",
		"element",
		"history",
		"location",
		"messages",
		"navigator",
		"popup",
		"scoping",
		"storage",
		"workers",
		"ws",
	],
	// Miscellaneous injected code
	injects: ["dom"],
};
