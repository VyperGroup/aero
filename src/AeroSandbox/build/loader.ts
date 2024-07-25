module.exports = content => {
	return content.replace(/<proxyNamespace>/g, "$aero");
};
