import { aeroPrefix } from "../../config.js";

const createScript = path => {
	const hasExt = path.split("/").at(-1).includes(".");
	return `\t<script src="${aeroPrefix}${path}${
		hasExt ? null : ".js"
	}"></script>\n`;
};

function unwrapImport(path) {
	return `\n${createScript(path)}\n`;
}

function unwrapImports(cats) {
	let ret = `\n${createScript("browser/misc/proxyLocation")}`;

	for (const cat in cats)
		ret +=
			cats[cat].map(file => createScript(`${cat}/${file}`)).join("") +
			"\n";

	return ret;
}

export { unwrapImport, unwrapImports };
