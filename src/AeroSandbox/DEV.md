# aero's Sandboxing library Dev Docs

## How to use (with faker)

Faker is an API that aero's sandbox can be built with that allows the state of the element to be fake. This is used to prevent sites from detecting modifications. This will be used in aero's middleware and in my undetectable adblocker.

In your bundle file

```ts
createAeroSandboxBundle({
  proxyLocation: ...
  jsRewriter: ...,
  FakerAPI: {
    enable: true, // This is necessary to use Faker
    allowFakerExcludes: true
  }
})
```

In the site itself (example usage)

```ts
const link = document.createElement("a");
link.href = "https://example.com";
// Exclusive
$aero.faker.freezeElementState(link);
link.href = "https://www.google.com";
console.log(link.href); // Still outputs https://example.com
// All of the element functions will work like normal
$aero.faker.setAttribute("referrerpolicy", "no-referrer");
console.log(link.getAttribute("no-referrer")); // Outputs "no-referrer" although the element doesn't actually contain it
```

## SW-less runtime for proxies

This will be a configurable extension for aero's sandboxing library (just like Faker), but it will intercept http requests and process them as a "fake SW". If it is disabled, the logic won't be compiled into the binary just like Faker.

Ways of using:

- Script marker -There will be a configurable option that will let you mark scripts as a "fake SW" with the attribute "type="sw"" on a script
- Extended API - You will be able to run $aero.sandbox.evalsw(<SW content>)
  Additionally (as two different configurable options), navigator.serviceworker.register will be proxified to add additional functionality: if the normal (not fake) SW registration fails for security reasons, it will try fetching it and piping the response body $aero.sandbox.evalsw. If this also fails or the registration failed for other reasons, it will check the [VFS](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestFileSystem), if it exists, to see if there is a SW in that path, and if there is it will read it and pipe it into $aero.sandbox.evalsw.

## Bonus 1: Exclude script from being "faked"

This will prevent the faker options from affecting the script

```html
<script fakerExcluded>
...
<script>
```

## Bonus 2: Hide element from the DOM

This may or may not be implemented in the final API. This would essentially be the same as running

```ts
$aero.faker.remove(<ELEMENT>);
```

in JS

```html
<h1 fakerHide></h1>
```

### How the faker API will be implemented

If the Faker API is enabled in the config in compile time, special code will be added to the element interceptor. We obviously wouldn't want to bundle extra code if the Faker API support is turned off. I will use [Babel Macros](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros) for this.

## How automatic API interception would work

The essence of API interception is parsing standard documents to create [concealers](Dictionary.md), which are API interceptors

### WHATWG

1. Scan for every class

#### Example from the [Response class](BareClientExtenders)

response.url = ...
