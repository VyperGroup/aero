/* Notice how the strings are wrapped in quotes. This is because Feature Flags need to be JSON-parseable */
export type QuotedString<T extends string> = `"${T}"`;

export type boolFlagType = QuotedString<"true"> | QuotedString<"false">;
