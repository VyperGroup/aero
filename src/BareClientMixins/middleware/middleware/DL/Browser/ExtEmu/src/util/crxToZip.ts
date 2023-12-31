function offset(a: number, b: number, c: number, d: number): number {
	let len = 0;

	len += a << 0;
	len += b << 8;
	len += c << 16;
	len += d << 24;

	return len;
}

export default (buf: ArrayBuffer): ArrayBuffer | false => {
	const dec = new TextDecoder("utf-8");
	const arr = new Uint8Array(buf);

	const magic = dec.decode(buf.slice(0, 4));

	if (magic === "Cr24") {
		const ver = arr[4];

		// Can be either a public key in the case of V2 or a generic in V3
		const head = offset(arr[8], arr[9], arr[10], arr[11]);

		if (ver === 2) {
			const sign = offset(arr[12], arr[13], arr[14], arr[15]);
			return buf.slice(16 + head + sign);
		} else if (ver === 3) return new Uint8Array(buf.slice(12 + head));
	}
	return false;
};
