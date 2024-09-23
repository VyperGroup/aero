// Lookup Table Type
type LookupTable = Map<string, Uint8Array>;

/**
 * This isn't your typical XOR encoder.
 * It precomputes the lookupTables into a map, but only for what would be in a valid URL, causing it to have smaller lookup tables.
 * This is ideal for proxies.
 */
export default class XOR {
	// key, the precomputed XOR lookup table
	lookupTables: LookupTable;

	constructor(precompKeys: string) {
		this.lookupTables = new Map();

		for (const precompKey of precompKeys) this.#compKey(precompKey);
	}

	#compKey(key: string): Uint8Array {
		const keyArr = new TextEncoder().encode(key);

		// Create lookup table for valid URL characters (65 characters)
		const urlLookupTable = new Uint8Array(65);
		for (let i = 48; i <= 57; i++)
			// Digits (0-9)
			urlLookupTable[i - 48] = i ^ keyArr[i % keyArr.length];
		for (let i = 65; i <= 90; i++)
			// Uppercase letters (A-Z)
			urlLookupTable[i - 55] = i ^ keyArr[i % keyArr.length];
		for (let i = 97; i <= 122; i++)
			// Lowercase letters (a-z)
			urlLookupTable[i - 61] = i ^ keyArr[i % keyArr.length];
		for (let i = 45; i <= 95; i++)
			// Symbols (-._~:/?#[]@!$&'()*+,;=)
			urlLookupTable[44 + i] = i ^ keyArr[i % keyArr.length];

		return urlLookupTable;
	}

	/**
	 * Gets the url lookup table, meanwhile creating it if it doesn't exist
	 */
	#getLookupTable(key: string): Uint8Array {
		let urlLookupTable: Uint8Array;

		if (!this.lookupTables.has(key))
			urlLookupTable = this.lookupTables.get(key);
		else {
			urlLookupTable = this.#compKey(key);
			this.lookupTables.set(key, urlLookupTable);
		}

		return urlLookupTable;
	}

	encodeUrl(urlStr: string, key: string) {
		const urlLookupTable = this.#getLookupTable(key);

		const textArr = new TextEncoder().encode(urlStr);
		const resultArr = new Uint8Array(textArr.length);

		// Encode using the URL lookup table
		for (let i = 0; i < textArr.length; i++) {
			const char = textArr[i];
			resultArr[i] =
				(char >= 48 && char <= 57) ||
				(char >= 65 && char <= 90) ||
				(char >= 97 && char <= 122) ||
				(char >= 45 && char <= 95)
					? urlLookupTable[char]
					: char;
		}

		return new TextDecoder().decode(resultArr);
	}
	decodeUrl(text: string, key: string) {
		const urlLookupTable = this.#getLookupTable(key);

		const textArr = new TextEncoder().encode(text);
		const resultArr = new Uint8Array(textArr.length);

		// Decode using the URL lookup table
		for (let i = 0; i < textArr.length; i++) {
			const char = textArr[i];
			resultArr[i] =
				urlLookupTable.indexOf(char) !== -1
					? urlLookupTable.indexOf(char)
					: char;
		}

		return new TextDecoder().decode(resultArr);
	}
}
