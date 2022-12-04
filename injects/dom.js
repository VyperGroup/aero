const rewriter = new MutationObserver((mutations, observer) => {
	for (let mutation of mutations)
		for (let node of mutation.addedNodes)
			if (node.nodeType === Node.ELEMENT_NODE) $aero.rewrite(node);
});

rewriter.observe(document, {
	childList: true,
	subtree: true,
});
