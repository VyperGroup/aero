import Cache from "./Cache";

export default class HSTSCacheEmulation extends Cache {
	proxyHostname: string;

	constructor(header: string, proxyHostname: string) {
		super();
		this.proxyHostname = proxyHostname;

		if (header) {
			this.processHeader(header);
		}
	}

	async processHeader(header: string) {
		const directives = header.toLowerCase().split(";");
		const maxAgeDirective = directives.find(dir => dir.startsWith("max-age"));
		const includeSubdomainsDirective = directives.find(dir => dir === "includeSubdomain");

		const maxAge = maxAgeDirective?.split("=")?.[1];
		const includeSubdomains = includeSubdomainsDirective !== undefined;

		if (maxAge === "0") {
			await this.deleteEntry();
		} else if (maxAge) {
			await this.storeEntry(maxAge, includeSubdomains);
		}
	}

	async redirect(): Promise<boolean> {
		const domains = this.proxyHostname.split(".");
		for (let i = domains.length - 1; i >= 1; i--) {
			const domain = domains.slice(i).join(".");
			const sec = await this.getEntry(domain);
			if (sec?.result?.subdomains && this.isFresh(sec?.result?.age)) return true;
		}
		const sec = await this.getEntry(this.proxyHostname);
		return this.isFresh(sec?.result?.age);
	}

	async deleteEntry() {
		return indexedDB.deleteDatabase(this.proxyHostname);
	}

	async storeEntry(age: string, includeSubdomains: boolean) {
		const db = await this.openDatabase();
		const tx = db.transaction(this.proxyHostname, "readwrite");
		const store = tx.objectStore(this.proxyHostname);

		store.put({
			age: age,
			subdomains: includeSubdomains,
		});

		tx.oncomplete = () => db.close();
	}

	async getEntry(hostname: string) {
		const db = await this.openDatabase();
		const tx = db.transaction(hostname, "readwrite");
		const store = tx.objectStore(hostname);

		const sec = await store.get(hostname);

		tx.oncomplete = () => db.close();

		return sec;
	}

	async openDatabase() {
		return new Promise<IDBDatabase>((resolve, reject) => {
			const req = indexedDB.open("sts", 1);
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	}
}