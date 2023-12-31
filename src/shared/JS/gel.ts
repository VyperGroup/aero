// Aerogel. This won't be default. The point of aero gel is that you overwrite location and proxy the window object, while having to skip more while parsing.

export default script => {
	return /*js*/ `

const fakeWindow = new Proxy(window, {
	apply() {

	}
})

(() => {
${script}
)).bind({
	window: 
})
	`;
};
