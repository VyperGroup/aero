import { proxyLocation } from "$shared/proxyLocation";

/** Escapes a string with underscores. */
export default function (str: string, origin = ""): RegExp {
	return RegExp(`^(?:${origin}_+)?${str}$`, "g");
}

/**
 * Escape a string with an origin in the prefix; useful for isolation.
 * @param origin Defaults to the current proxy origin.
 * */
function escapeWithOrigin(
	str: string,
	origin = proxyLocation().origin
): string {
	return `${origin}_${str}`;
}

export { escapeWithOrigin };
