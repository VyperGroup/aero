export default (params: URLSearchParams, param: string): string | false => {
	const item = params.get(param);

	if (item) {
		params.getAll(`_${item}`).forEach(v => params.append(item, v));
		params.delete(`_${item}`);

		return item;
	}

	return false;
};
