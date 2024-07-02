const config: AeroSandboxTypes.Config = {
	rewriters: {
		html: {
			/** DOMParser will be the default */
			mode: "DOMParser" | "Mutation Observer",
			replaceRedirectorsWithNavigationEvents: true,
		},
	},
	// TODO: This is nowhere near what is planned. Read index.d.ts for an idea of what is coming next
};

export default config;
