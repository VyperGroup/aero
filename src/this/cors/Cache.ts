export default class {
	isFresh(age: number): boolean {
		return age < this.getTime;
	}

	// Get time in seconds
	get getTime(): number {
		return (Date.now() / 1000) | 0;
	}
}
