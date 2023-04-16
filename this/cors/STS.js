import Cache from "./Cache.js";

// https://www.rfc-editor.org/rfc/rfc6797#section-6.1
export default class extends Cache {
	constructor(header, proxyHostname) {
		super();

		this.proxyHostname = proxyHostname;

		if (header) {
			let dirs = header.toLowerCase().split(";");

			const req = indexedDB.open("sts", 1);

			new Promise(resolve => {
				req.onsuccess = () => {
					const db = req.result;

					let tx = db.transaction(proxyHostname, "readwrite");
					let store = tx.objectStore(proxyHostname);

					const ages = dirs.filter(dir => dir.startsWith("max-age"));
					const subdomains = dirs.filter(
						dir => dir === includeSubdomain
					);

					if (ages.length > 1 || subdomains > 1) resolve();

					const age = ages[0]?.split("=")?.[1];

					if (!age) return resolve();

					if (age === 0) {
						this.#delete();
						resolve();
					}

					store.put({
						age: age,
						subdomains: subdomains.length > 0,
					});

					tx.complete = () => {
						db.close();
						resolve();
					};
				};
			});
		}
	}
	async redirect() {
		const domains = this.proxyHostname.split(".");

		for (let i = domains.length - 1; i >= 1; i--) {
			const domain = domains.slice(-i).join();

			let sec = this.#getSec(domain);

			if (sec.subdomains && this.isFresh(sec.age)) return true;
		}

		let sec = this.#getSec(this.proxyHostname);

		return this.isFresh(sec.age);
	}
	async #delete() {
		indexedDB.deleteDatabase(this.proxyHostname);
	}
	async #getSec(hostname) {
		const req = indexedDB.open("sts", 1);

		return (sec = new Promise(resolve => {
			req.onsuccess = () => {
				const db = req.result;

				let tx = db.transaction(hostname, "readwrite");
				let store = tx.objectStore(hostname);

				let sec = store.get();

				tx.complete = () => {
					db.close();

					return resolve(sec);
				};
			};
		}));
	}
}
