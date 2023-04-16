export default isMod =>
	`
// I might want to use a promise for this
(async () => {
	async function calc(integrity, html) {
		const [rawAlgo, hash] = integrity.split("-");

		const algo = rawAlgo.replace(/^sha/g, "SHA-");

		const buf = new TextEncoder().encode(html);

		const calcHashBuf = await crypto.subtle.digest(algo, buf);

		const calcHash = new TextDecoder().decode(calcHashBuf);

		// If mismatched hash
		const blocked = hash === calcHash;

		// Exit script
		if (blocked) throw new Error("Script blocked");
	}
	${
		isMod
			? `
	const integrity = import.meta.url.searchParams.get("integrity");
	
	if (integrity) await calc(integrity, body);
	`
			: `
	if (
		document.currentScript.hasAttribute("_integrity")
	)
		await calc(
			document.currentScript._integrity,
			document.currentScript.innerHTML
		);
`
	}
})();
`
		.split("\n")
		.map(l => `\t${l}`)
		.join("\n");
