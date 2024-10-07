export type boolFlagType = "true" | "false";

/* Notice how the strings are wrapped in quotes. This is because Feature Flags need to be JSON-parseable */
export type QuotedString<T extends string> = `"${T}"`;
