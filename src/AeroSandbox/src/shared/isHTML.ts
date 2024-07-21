export default (type: string): boolean =>
	type.startsWith("text/html") || type.startsWith("application/xhtml+xml");
