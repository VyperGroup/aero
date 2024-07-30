export default (str: string, proxyNamespace: string) => {
	return str.replace(/<proxyNamespace>/g, proxyNamespace);
};
