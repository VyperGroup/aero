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
	// FIXME: Doesn't work on sites like https://www.aquarium.ru/en and https://radon.games
	const integrity = import.meta.url.searchParams.get("integrity");
	
	if (integrity) await calc(integrity, body);
	`
			: `
	if (
		// FIXME: Doesn't work in async scripts like found on https://discord.com/
		document.currentScript &&
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
