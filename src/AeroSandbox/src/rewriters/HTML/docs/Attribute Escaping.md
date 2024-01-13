# Attribute Escaping

## The traditional approach

After the attributes have been modified by the rewriter, the unmodified version will be saved in an attibute. This creates a vector to where the proxy can be detected. To solve this the proxy:

- intercepts the APIs that return an Element and ovewrites those API methods with a Proxy using apply
- makes a copy of the return get that element through. The return value is provided from Reflect.apply
- overwrites that Element with custom getters and setters for the element. where the copy of the return will be returned to the proxy

### The problem

It's best to not have to proxy elements (DOM interception), if you don't need to, to prevent unnecessary overhead

## What aero does instead

### 🏆 With [attribute emulation](./Attribute%20Rewriting%20methods.md/### 🏆 Attribute Emulation method)

Aero doesn't actually need to escape the attributes, because with this method it doesn't need to keep track of the previous values.

### With attribute rewriting methods

Instead of escaping, aero cleverly uses WeakMap to keep track of the old values. The key is the rewritten element and the value is the original. This also allows for garbage collector to clear up values on its own.
