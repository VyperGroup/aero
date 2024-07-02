# Index

This index only lists features that are used in aero by default

## Style

### Proposals

Any subheading that ends with 🧪 means that it is a Proposal and that aero will support it eventually. These documents will contain the simple future tense only for things that haven't yet been implemented

Any file that soley consists of proposals it will have `PROPOSAL` at the end of the file's name and the main heading will have 🧪 at the end of it, if everything in the document is unfinalized. You can also put 🧪 wherever needed. Treat them as a TODO.

### Drafts

These are similar to Proposals, but for documents that will change much, and should be treated as a rough collection of my ideas, not anything to base the future work on. These use the emoji 📝. For any subheadings that are ready to be in the proposal, add 🧪 to the subheading.

### Alternate methods

Whenever there are multiple subheadings in a `Methods`` heading, if there is a 🏆 emoji at the end, it means that it is the default method that aero uses. The medals signify the fallback number. The awards must come before the 🧪.

## Glossary

- Forwarding: This signifies that values from an object are going to passed down to the new object. This usually means in proxies, that you are going to passthrough the real value to the proxied value.
- Origin
  - Origin: This is the origin of the site, as given by location.origin
  - Proxy Origin: This is usually whatever is after `${proxySiteUrl}/${proxyPrefix}/...` With the ... being the URL decoded, if it was encoded. In aero's sandboxing library, you can get this from proxyLocation().origin. The whole essence of proxification.
    > Be very careful. If you see `the proxy site's origin` that means the actual origin of the proxy site, not the origin in the proxified location
- Proxified: This means that an object has been intercepted to reflect it, as if it was running under the proxy origin rather than the real origin.
- Emulation: This means that you are replicating a browser feature, without intercepting the API. In some cases, this is the possible way to do things. Especially when you consider that with the security headers, where you can only specify an origin, not a pathname (that would contain the proxy origin in it).
- Double parsing - This refers to the phenomenon when proxies parse the entire document rather than intercept what's needed. This causes the parser to be parsing it twice, since the browser engine has already parsed the entire document for its own purposes.
- [Domain Fronting](./Domain%20Fronting.md#DomainFronting) (this term is mainly for proxy site hosters, if you are a dev you don't need to worry about this)
- [Edge cases](https://en.wikipedia.org/wiki/Edge_case) (this term is common in aero, because aero covers a lot of scenarios that you normally wouldn't need as a proxy hoster)

> There are [more terms](../../src/AeroSandbox/docs/Index.md#glossary) in AeroSandbox
> Also see [Common Misconceptions](./Common%20Misconceptions.md)

### Sandboxing

> You can find sandboxing-related terms [here](../../src/AeroSandbox/docs/Index.md#glossary)

## Order of which to read

### Foreword

1. [Common Misconceptions](./Common%20Misconceptions.md)
2. [Web Standards](./Web%20Standards.md)
3. [JSDoc](./JSDoc.md)

### The Basics

1. [The Purpose of a SW](./The%20Purpose%20of%20a%20SW.md)
2. [Request Intereption](./Request%20Interception.md)
3. [The No-parse Philosophy](./The%20No-parse%20Philosophy.md)
4. [Sandboxing](../../src/AeroSandbox/Index.md)

#### Extra things

1. [URL Encoding](./URL%20Encoding.md)

## If you want to help contribute

1. If you want to become an aero contributor please read [the contributing guide](./docs/CONTRIBUTING.md). Treat this more as a style guide than requirements. You are still free to express yourself however you want to.
2. [Take a look at the TODOs](TODO.md). These should give you a better overview of what needs to be done.

## Code Directory listing

- **[src](./src)** - Aero's _actual_ code that is built
- **[src/AeroSandbox](../../src/AeroSandbox/)** - The library that powers the interception techniques that aero uses.

## Optional

If you are learning proxies for the first time, I highly recommend that you don't peek at these just yet. These are optional and are only needed for certain edge-cases.

- **[altBackends](../../src/altBackends)** - Alternative backends rather than using a SW made for unique environments
- **[tests](../../tests/)** - Unit testing
- **[dist](../../dist)** - Build files for aero. This is what you actually need to use aero on your site. These won't be present until you run `pnpm run build`.
