import DoHServers from "$EXT_EMU_config";

const bcDoH = new BroadcastChannel("BROWSER_DOH");
bcDoH.onmessage = e => (DoHServers = e.data);
bcDoH.postMessage("Query");

// @ts-ignore
browser.dns = {};

browser.dns.resolve = async (hostname, flags) => {
	for (const doh of DoHServers) {
		const url = new URL(`https://${doh}/dns-query`);

		url.searchParams.set("name", hostname);
		url.searchParams.set("type", flags["canonical_name"] ? "CNAME" : "A");

		try {
			const json = await (
				await fetch(url, {
					headers: {
						accept: "application/dns-json",
					},
				})
			).json();

			let ans = json.Answer;

			if (!flags["canonical_name"]) {
				if (flags["disable_ipv4"]) ans.filter(ans => ans.type === 28);
				if (flags["disable_ipv6"]) ans.filter(ans => ans.type === 1);
			}

			return ans.map(ans => ans.data);
		} catch {}
	}

	// Not found
	let res: browser.dns.DNSRecord = {
		addresses: [],
		isTRR: "false",
	};
	if (flags["canonical_name"]) res.canonicalName = "";
	return res;
};
