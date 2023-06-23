import rewrite from "browser/rewriters/html";

new MutationObserver(mutations => {
	for (let mutation of mutations)
		if (mutation.type === "childList")
			for (let node of mutation.addedNodes)
				if (node instanceof HTMLElement) rewrite(node);
				else
					for (let attr of mutation.attributeName)
						if (mutation.target instanceof HTMLElement)
							rewrite(mutation.target, attr);
}).observe(document, {
	childList: true,
	subtree: true,
});
