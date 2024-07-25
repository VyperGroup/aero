import Cache from "./Cache";

/**
 * Class for emulating HSTS cache behavior using IndexedDB.
 *
 * @extends {Cache}
 */
export default class HSTSCacheEmulation extends Cache {
	/**
	 * The hostname of the proxy server.
	 *
	 * @member
	 */
	proxyHostname: string;

	/**
	 * Constructs a new HSTSCacheEmulation instance.
	 *
	 * @param hsts - The HSTS header value.
	 * @param proxyHostname - The hostname of the proxy server.
	 */
	constructor(hsts: string, proxyHostname: string) {
		super();
		this.proxyHostname = proxyHostname;

		if (hsts) {
			this.processHSTS(hsts);
		}
	}

	/**
	 * Processes the HSTS header and stores the relevant information in IndexedDB.
	 *
	 * @param hsts - The HSTS header value.
	 * @returns
	 */
	async processHSTS(hsts: string): Promise<void> {
		const directives = hsts.toLowerCase().split(";");
		const maxAgeDirective = directives.find(dir =>
			dir.startsWith("max-age")
		);
		const includeSubdomainsDirective = directives.find(
			dir => dir === "includeSubdomain"
		);

		const maxAge = maxAgeDirective?.split("=")?.[1];
		const includeSubdomains = includeSubdomainsDirective !== undefined;

		if (maxAge === "0") {
			await this.deleteEntry();
		} else if (maxAge) {
			await this.storeEntry(maxAge, includeSubdomains);
		}
	}

	/**
	 * Redirects to HTTPS if an HSTS entry exists for the given hostname or its subdomains.
	 *
	 * @returns - Whether a redirect should be performed.
	 */
	async redirect(): Promise<boolean> {
		const domains = this.proxyHostname.split(".");
		for (let i = domains.length - 1; i >= 1; i--) {
			const domain = domains.slice(i).join(".");
			const sec = await this.getEntry(domain);
			if (sec?.result?.subdomains && super.isFresh(sec?.result?.age)) {
				return true;
			}
		}
		const sec = await this.getEntry(this.proxyHostname);
		return super.isFresh(sec?.result?.age);
	}

	/**
	 * Deletes the HSTS entry for the given hostname.
	 *
	 * @returns
	 */
	async deleteEntry(): Promise<void> {
		await indexedDB.deleteDatabase(this.proxyHostname);
	}

	/**
	 * Stores an HSTS entry in IndexedDB.
	 *
	 * @param age - The max-age value of the HSTS header.
	 * @param includeSubdomains - Whether the HSTS header includes subdomains.
	 * @returns
	 */
	async storeEntry(age: string, includeSubdomains: boolean): Promise<void> {
		const db = await this.openDatabase();
		const tx = db.transaction(this.proxyHostname, "readwrite");
		const store = tx.objectStore(this.proxyHostname);

		store.put({
			age: age,
			subdomains: includeSubdomains
		});

		tx.oncomplete = () => db.close();
	}

	/**
	 * Retrieves an HSTS entry from IndexedDB.
	 *
	 * @param hostname - The hostname to retrieve the entry for.
	 * @returns
	 */
	async getEntry(hostname: string): Promise<IDBRequest<any>> {
		const db = await this.openDatabase();
		const tx = db.transaction(hostname, "readwrite");
		const store = tx.objectStore(hostname);

		return store.get(hostname);
	}

	/**
	 * Opens the IndexedDB database.
	 *
	 * @returns
	 */
	async openDatabase(): Promise<IDBDatabase> {
		return new Promise<IDBDatabase>((resolve, reject) => {
			const req = indexedDB.open("sts", 1);
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	}
}
