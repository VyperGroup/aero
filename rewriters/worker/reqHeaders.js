export default headers => {
	const rewrittenHeaders = {};

	Object.keys(headers).forEach(key => {
		const value = headers[key];

		rewrittenHeaders[key] = value;
	});

	return rewrittenHeaders;
};
