export default async (api: string): string[] => {
	const text = await (
		await fetch(
			"https://raw.githubusercontent.com/mdn/content/main/files/en-us/mozilla/add-ons/webextensions/api/browsersettings/index.md",
		)
	).text();

	return [
		...text.matchAll(
			new RegExp(
				String.raw`(?<={{WebExtAPIRef\(\"${api}\.).*(?=\"\)}})`,
				"g",
			),
		),
	];
};
