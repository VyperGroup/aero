# CONTRIBUTING

## Guidelines

- Don't commit without using a formatter beforehand
- Don't use the built-in Github Web Editor to commit multi-file changes. I will know if you do this, and I will deny your pull request. If this happens again, you will be blocked.
- Write sensible commit names and descriptions
- [Use imperative commit naming](https://stackoverflow.com/a/3580764)
- Try to use [emojis in git](https://gitmoji.dev)
- If you make any changes to the API interceptors, ensure the tests still pass
- Try your best to follow the style of aero

## Recommendations

- Setup [biomejs](https://biomejs.dev/guides/integrate-in-editor/#third-party-plugins) (preferrable) or [prettier](https://prettier.io/docs/en/editors.html) integrations in your IDE
- If none of tools used suite you, feel free to make a PR for however you like
- If you are on VSCode, install the recommended extensions
- If you want to learn aero's codebase faster, **read all of the docs**
- If you want to speed up reptitive tasks, use Phind (free and my choice) or any GPT assistant that is well-integrated with your codebase. I also recommend [the open source models on HuggingFace](https://huggingface.co/chat). They seem to be accurate. **Do not use AI in situations where you don't know the language or libraries used.** While it is mostly fine, if you have accurate tests, you must also audit your code with someone who knows the concepts well to ensure that there is no security holes with the generated code.
-

### Documentation

- Write in the present simple tense by default, unless you are writing a proposal document, where you would write in the future tense
- Audit your additions using a [grammer checker](https://quillbot.com/grammar-check). If it advises you to rewrite in a passive voice I recommend that you ask a GPT to do that, rather than paying for premium.

## How to help without knowledge of programming

You could help write documentation, or find domain fronting exploits.

## Style Guide

### Order of imports

1. Type imports
2. Config imports
3. Standard libraries (Runtime APIs)
4. External libraries
5. Internal libraries

> If there are multiple in each subcategory, then list whichever is used first

### Order of booleans

1. Always check for web compatiblity

### Comment-specific

- If various comments span multiple files, add that topic to the respective [TODO.md](https://xit.jotaen.net/syntax-guide) in the directory, if it exists. These are what you would call milestones.
- Put line-specific comments on the line you are referencing (not before the line)
- If the sentence is multi-lined put a period at the end, if not then don't use periods at all
- If there is only one comment necessary for a line, put the comment after the line itself
- If a comment concerns multiple lines, try to estimate how many lines it covers (E.g. _~4, ..._)
- Put the more specific comments to the issue closer to the actual LOC

### Miscellaneous

- If you are concatinating more than two strings use a template string, or else just the unary operator (+)

## FAQ

### I want to contribute, but I don't know how the SW APIs work

Don't be overwhelmed

I recommend reading <https://developer.chrome.com/docs/workbox/service-worker-overview> and then <https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers>

SW's simply make network requests easier to intercept
