# The HTML Attribute Sandboxing Methods

The rewriting and emulation code is found [here](../../src/rewriters/shared/rules.ts). This is an abstraction to support as many methods as possible.

## Misc

Script elements with inline code and elements with integrity values set need to be cloned due to the browser's security restrictions.

## Methods

### Parsing

This won't be included in aero, due to it causing double parsing and it is on the server, which slows down the proxy and is against aero's goals.

> This was the only and traditional method of HTML attribute rewriting, prior to aero's existance.

### DomParser

This involves (in an injected script):

1. A doctype declaration and storing the HTML inside of a string in a script on the site, rather than the original response body
2. Using DomParser inside of the HTML string
3. Rewriting those elements
4. Appending the elements to the document. This is an improvement to [the parser method](#parsing).

### MutationObserver

HTML is intercepted and rewritten through a Mutation Observer where important elements are rewritten. The only problem with this is that Mutation Observers send events for everything and those event handlers are blocking, which really slows down the site.

> This was the original method adopted by aero

### 🥈 Custom Elements + Rewriting the `is` Attribute

This doesn't use MutationObservers and is faster than the traditional method, because it doesn't intercept every HTML attribute. It also works in browsers that don't support Mutation Observers but support custom elements.

This requires hooks into the element creation APIs to prevent

> This is used in Faker

1.  Create a custom element that extends the native element
2.  For that element, add the is attribute set to the custom element, when it is created. You can do this in a mutation observer, but you could also do it then.
    > Here are two methods that would work without a MutationObserver or Mutation Events
        - Inserting the HTML through the DOM APIs in a script and add the is property to all of them that way
        - Register a Mutation Observer that rewrites all of the native elements to use add the is property

### 🏆 Attribute Emulation

This doesn't use mutation events, mutation observers, or web components

As you probably know, when you overwrite a property it looses its functionality. You would instead have to make a custom element that extends a native one, if you want to maintain functionality and intercept (proxy). This avoids the need for that. Every current HTML element that needs to be rewritten can actually be overwritten and emulated.

For example here's the attribute:

- [ ] href - For links, you can add a click event, that uses window.open, and disable functionality of href, making you respect the rel attribute. I will make it so that you can choose to globally intercept all click events (simpler) or specifically link elements (faster). When using href for linking stylesheets, this is a bit tricky. You would have to inline the stylesheets.
  - [ ] Find out if inline stylesheets are different from external ones
- [ ] meta - Some of these attributes will have to be emulated
- [ ] src - You will have to inline the script and then hide the innerHTML. While inlining, you need to inject a single line that proxies document.scriptElement to return one that doesn't have the rewritten attributes, similarly to how document.scriptElement needs to be proxied so that integrity seems to still. You will also have to run it all inside of a scope {}, so that it can't access unscoped vars from other scripts.
- [ ] integrity - This needs to be emulated anyways, due to the script being rewritten, so it doesn't actually matter
