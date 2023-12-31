import afterPrefix from "$aero/shared/afterPrefix";

// Interceptors for Stylesheets

function getSheet(sheet) {
	if (sheet.href) sheet.href = afterPrefix(sheet.href);
	if (sheet.parentStyleSheet)
		sheet.parentStyleSheet = getSheet(sheet.parentStyleSheet);

	return sheet;
}

/*
Object.defineProperty(document, "styleSheets", {
	get: () => {
		// StyleSheetList is read-only so the getter itself needs to be proxified
		ret.item = new Proxy(ret.item, {
			apply() {
				return getSheet(Reflect.apply(target, that, args));
			},
		});

		return ret;
	},
});
*/

// TODO: Support XML ProcessingInstruction.sheet
