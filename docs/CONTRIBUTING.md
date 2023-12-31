# CONTRIBUTING

## Guidelines

- Don't commit without using a formatter beforehand
- Don't use the built-in Github Web Editor to commit multi-file changes. I will know if you do this, and I will deny your pull request. If this happens again, you will be blocked.
- Write sensible commit names and descriptions
- If you make any changes to the API interceptors, ensure the tests still pass
- Try your best to follow the style of aero

## Recommendations

- Setup [biomejs](https://biomejs.dev/guides/integrate-in-editor/#third-party-plugins) (preferrable) or [prettier](https://prettier.io/docs/en/editors.html) integrations in your IDE
- If none of tools used suite you, feel free to make a PR for however you like
- If you are on VSCode, install the recommended extensions
- If you want to find something to contribute to, search in your editor for TODO comments and look in TODO.xit for generalized ideas
- If you want to learn aero's codebase faster, **read all of the docs**

## How to help without knowledge of programming

You could help write documentation, or find CDN's to exploit.

## Style Guide

### Order of imports

1. Type imports
2. Config imports
3. Standard Libraries (Runtime APIs)
4. External Libraries
5. Internal Libraries

### Order of booleans

1. Always check for web compatiblity

### Comment-specific

- Put line-specific comments before the line you are referencing. Not after on the same line.
- If the sentence is multi-lined put a period at the end, if not then don't use periods at all

### Miscellaneous

- If you are concatinating more than two strings use a template string, or else just the unary operator (+)
