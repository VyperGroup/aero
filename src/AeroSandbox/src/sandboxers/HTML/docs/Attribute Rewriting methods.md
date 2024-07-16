# Attribute Rewriting Methods

The the common rewriting code is found [here](../shared/rules.ts). This is an abstraction to support as many methods as possible.

> ⚠️ WARNING: This document is highly out of date; please don't read it. It will be updated soon.

## Navigation Events to intercept redirect hrefs

This will be available in aero and will supplement the other methods. If this is enabled, the other methods will not try to rewrite the href themselves and rely on this supplemental method of doing it.

See the [doc](../../../../docs/Redirection%20Interception%20DRAFT.md) for more details

> Keep in mind Navigation Events are still in the draft stage

## Full HTML rewriting

With all of these methods you have to write concealers for every attribute that you modify

### DOMParser + Escaping that HTML

With these methods, you also have to write code inside of your HTML element interceptors that rewrite the HTML elements.

#### SW

There is no DOMParser support in a SW. You could always polyfill DOMParser to run the same rewriting code as [Injected Script](#inject-🏆), but I recommend using [parse5](https://parse5.js.org) for the performance, since we don't must recreate an entire DOM.

Return the rewrote HTML as the response body.

#### Inject 🏆

1. Inject a script and escape the HTML in a JS string
2. Run DOMParser on it
3. Rewrite the HTML elements according to the rules
4. Inject that document into the main DOM
5. Make sure to delete the injected script

This method is faster because:

1. It does not bottleneck the SW
2. It does not parse twice, although it does introduce two extra DOM operations (4-5)

#### Mutation Observer

1. Inject a Mutation Observer to intercept HTML, rather than parsing it
2. Rewrite the HTML elements according to the rules
3. Inside of the concealers, you must conceal the script you are in (that is running the Mutation Observer)

Pros:

- It is easier, but not by much, to implement because it requires less code inside of the DOM API interceptors, because you don't have to write any code to rewrite the HTML inside of those interceptors; you only have to focus on writing concealers.

Cons:

- There is a significant delay compared to parsing.
