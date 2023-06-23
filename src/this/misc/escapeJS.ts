export default (str: string) =>
	str
		.replace(/`/g, String.raw`\``)
		.replace(/\${/g, String.raw`\${`)
		.replace(/<\/script>/g, String.raw`<\/script>`);
