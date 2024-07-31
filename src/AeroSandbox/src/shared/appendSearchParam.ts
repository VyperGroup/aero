import type { SearchParamOptions } from "../../../../types/catch-all";

// appendSearchParam.ts
export default (
	searchParams: URLSearchParams,
	searchParamOptions: SearchParamOptions,
	str: string
) => {
	// Until a compatible search param is found
	const escapingCharCount = 0;
	while (true) {
		let escapesStr = "";
		for (let i = 0; i < escapingCharCount; i++)
			escapesStr += searchParamOptions.escapeKeyword;

		// Try the search param with yet another escapeChar
		const paramToTry = escapesStr + searchParamOptions.searchParam;
		if (!searchParams.has(paramToTry))
			return searchParams.set(paramToTry, str);
	}
};
