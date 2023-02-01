export default (aeroPrefix, cats, escape) => {
	const createScript = path =>
		`<script src="${path}"><${escape ? "\\" : ""}/script>`;

	var ret = "\n";

	for (const cat in cats)
		ret +=
			cats[cat]
				.map(file => createScript(`${aeroPrefix + cat}/${file}.js`))
				.join("\n") + "\n";

	return ret;
};
