function getWords(wordsStr): string[] {
	const letters = wordsStr.split();

	let words: string[] = [];
	let word = null;
	for (const letter of letters) {
		if (/[A-Z]/g.test(letter)) {
			if (word !== null) words += word;
			word = letter;
		} else word += letter;
	}

	return words;
}

export default (str, base?: string) => {
	const words = getWords(base, str.replace(new RegExp("^" + base, "g")));
	const part = words.map(word => `_${word.toUpperCase()}`).join();
};
