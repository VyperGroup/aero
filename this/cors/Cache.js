export default class {
	isFresh(age) {
		return age < this.getTime;
	}

	// Get time in seconds
	get getTime() {
		return (Date.now() / 1000) | 0;
	}
}
