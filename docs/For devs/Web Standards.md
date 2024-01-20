# Getting used to the web standards

## TompHTTP

## Web standards

> [MDN](https://mdn.dev) is a a great starting point. They aggregate these standards into easy to digest articles for beginners. They are great for getting the gist of things.

### Standard organizations

- [W3C](https://www.w3.org/) - Anything that is not covered by the standard organizations below is found there
- [ECMAScript](https://ecma-international.org/publications-and-standards/standards/ecma-262) - Anything that has to do with the JS _language_ itself is found there. Browser APIs aren't specified by ECMAScript and you should refer to W3C standards for them.
- [WhatWG](https://whatwg.org/) - A consortium of big tech companies that dictate how HTML 5 evolves. Note that specifications for older XML-based markup langauges and CSS is still provided by the W3C.
- [IETF RFCs](https://www.ietf.org/standards/rfcs/) - This is where you can find the documentation on specific web protocols

> In aero, anything that is in draft stages has to be enabled under the "experimental" flag and anything that is deprecated has to be enabled under the "legacy" flag.

## Typings

> This section only applies to proxies that use [TS](https://www.typescriptlang.org), which I do recommend. Proxies can easily get complex over time and debugging them is a difficult task.

Sometimes the most up to date standards don't yet have inclusion in lib.dom.ts, where the APIs on window usually are defined. While you could extend the window interface like this:

````ts
declare global {
  interface Window {
    ```New API```: any;
  }
}
````

it's not safe to implicitly declare a property as any. Instead, you should be using the WebIDL interfaces provided in the standard documents themselves. I recommend using [webidl2ts](https://github.com/giniedp/webidl2ts) for this purpose.
