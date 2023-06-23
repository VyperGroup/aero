import Cache from "./Cache";

// Strict Transport Security
export default class extends Cache {
	proxyHostname: string;

	constructor(header: string, proxyHostname: string) {
		super();

		this.proxyHostname = proxyHostname;

		if (header) {
			let dirs = header.toLowerCase().split(";");

			const req = indexedDB.open("sts", 1);

			const db = new Promise(resolve => {
				req.onsuccess = () => {
					resolve(req.result);
				};
			});

			let tx = db.transaction(proxyHostname, "readwrite");
			let store = tx.objectStore(proxyHostname);

			const ages = dirs.filter(dir => dir.startsWith("max-age"));
			const subdomains = dirs.filter(dir => dir === "includeSubdomain");

			if (ages.length > 1 || subdomains.length > 1) return;

			const age = ages[0]?.split("=")?.[1];

			if (!age) return;

			if (age === "0") {
				this.#delete();
				return;
			}

			store.put({
				age: age,
				subdomains: subdomains.length > 0,
			});

			tx.complete = () => {
				db.close();
			};
		}
	}
	async redirect(): Promise<boolean> {
		const domains = this.proxyHostname.split(".");

		for (let i = domains.length - 1; i >= 1; i--) {
			const domain = domains.slice(-i).join();

			let sec = this.#getSec(domain);

			if (sec.subdomains && this.isFresh(sec.age)) return true;
		}

		let sec = this.#getSec(this.proxyHostname);

		return this.isFresh(sec.age);
	}
	async #delete(): Promise<void> {
		indexedDB.deleteDatabase(this.proxyHostname);
	}
	async #getSec(hostname: string): Promise<string> {
		const req = indexedDB.open("sts", 1);

		const db = new Promise(resolve => {
			req.onsuccess = () => {
				resolve(req.result);
			};
		});

		let tx = db.transaction(hostname, "readwrite");
		let store = tx.objectStore(hostname);

		let sec = store.get();

		tx.complete = () => {
			db.close();
		};

		return sec;
	}
}
