# Attribute Escaping

> ⚠️ WARNING: This document is highly out of date; please don't read it. It will be updated soon.

## The traditional approach

After the rewriter has modified the attributes, the unmodified version is saved in an attribute. Unfortunately, the new attribute creates a vector where the proxied site can detect the proxy. To solve this, the proxy:

- intercepts the APIs that return an HTML Element and overwrites those API methods with a Proxy using the apply function trap in the ES6 Proxy.
- Make a copy of the return and get that HTML Element through the return value provided from `Reflect.apply`
- overwrites that HTML element with custom getters and setters for the HTML Element. Where the copy of the return will be returned to the proxy

### The problem

It's best not to have to proxy elements (DOM interception) if you don't need to to prevent unnecessary overhead.

## What aero does instead

### 🏆 With [attribute sandboxing](./Attribute%20Sandboxing%20methods.md/### 🏆 Attribute Emulation method)

Aero doesn't need to escape the attributes because, with this method, it doesn't need to keep track of the previous values.

### With attribute sandboxing methods

Instead of escaping, aero cleverly uses WeakMap to keep track of the old values. The key is the rewrote element, and the value is the original. This method also allows garbage collectors to clear up values on their own. Essentially what this means is, when the Element is deleted it will be gone from the map so that less memory is used.
