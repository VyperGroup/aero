# JS Sandboxing - DRAFT 📝

TODO: Bring back parts of the old version of this doc

> ⚠️ WARNING: This document is highly out of date; please don't read it. It will be updated soon.

## AeroGel 🏆

TODO: Finish writing this section

You bind a scope to an object on GlobalThis whose prototype is the window, overwrite the variables you want to conceal on that window and pass in the variables you want to override as arguments through Function.prototype.call(). You want to create a new Function() and pass in the script's content through a function with the parameters of the variables you want to overwrite. You need to overwrite and proxy globalThis, eval, and location. This will be the function that you use to execute the call. Inside the function, you must take the script content and scope every instance of var, let, and const to "jail" it, which is remarkably cheap and easy to parse.

Scoping method 1:

You either put an open parenthesis after the "var" and a prefix before the "var" keyword and then a closed parenthesis right before the statement ends while replacing the assignment operator with commas so that it is all one big method that emulates a variable in var/let/const. You would need to be careful not to match deconstructors.

Scoping method #2

You could also do emu*<var/let/const>.<var_name> = ... (emu* is the chosen prefix in this case) and emulate the variable with getters and setters. You would need to do emu*decon*<var/let/const> = ... (its own unique prefix), and you copy those object properties into the tree you are storing your existing emulated variables. The trees would be different
Yes, you are parsing but it is extremely cheap

### more

The trick to not sharing block-scoped scripts everywhere and sharing only in the top level of the script is to make emu*<let/const> equal to emu_var in the top level and in the function scopes emu*<let/const> needs to be modified to have its own private var tree. This would be done by proxifying Function.prototype to make every function contain code to declare its own private var tree in a trap variable named emu\_<let/const>.

You could do some advanced parsing to make every top-level let/var/const to be emu*var unless it is inside of a function scope where it would be emu*<let/const> if it were a let or const declaration, but that would be expensive and require a real parser; LAME!

What you need to watch for is that eval can't be overwritten in strict functions and module scripts don't share the same block scope as normal scripts. They have their own private one.

## DSPC

## Traditional JS parsing

AST is inefficient because you have to copy everything and keep track of it in a tree
It is better to rewrite as you go, but that is impossible with JS because you don't know what is next since it is a scripting language. That is why I use half-parse methods in AeroGel and DPSC.

## ShadowRealm

[ShadowRealm](https://github.com/tc39/proposal-shadowrealm/blob/main/explainer.md) is an upcoming browser API that will allow you to modify the realm of JS, basically allowing you to control the scope more easily than before.

We can actually use it right now!

The essence of the [polyfill](https://github.com/ambit-tsai/shadowrealm-api) works is basically binding a prototype version of the window object that has been modified to be proxified. This polyfill works exactly like aero gel, but it uses the ShadowRealm API, which is only available on the [Safari Technology Preview](https://developer.apple.com/safari/technology-preview)

### Example

// proxyRealmLocation.ts (aero.sandbox.proxyRealm.js)

```ts
import { proxyLocation } from "$shared/proxyLocation";

fakeLocation = proxyLocation();

export { fakeLocation };
```

// proxyRealm.ts

```ts
const proxyRealm = new ShadowRealm();

const proxyWin = await realm
  .importValue("./aero.sandbox.proxyRealmLocation.js", "location")
  .then(() => {});
```

And then in every script you run the script inside of the realm. The elipses denote where the original src go

```ts
proxyWin.evaluate("...");
```

### The issue here

Using the ShadowRealm would require a module script that the browser would fetch. You would have to delay the site loading until you set up your sandbox, waste resources rewriting scripts to wrap them in the sandbox, and finally use API interceptors to make the changes to those scripts undetectable. To set up the sandbox, you need to wait for a promise to import the values, and it needs to fetch an ES6 module, so we would have to wait for it to import a whole copy of the window into it and then inject the HTML into the site. By the way, the ShadowRealm polyfill works similarly to AeroGel. Still, it is heavier because it requires more scoped.
