# Cache

## Cache Emulation

HTTP caches are emulated by a system using aero's service worker's cache stores. This allows caches to be stored for a specific origin rather than apply to the whole site with the actual header. Another reason why this is needed is because the Clear-Site-Data deletes every origin's cache, making aero otherwise detectable.

TODO: Document how it works

## Cache Manifest Rewriting

aero rewrites the paths in the cache manifests files using the [src rewriter](../../src/AeroSandbox/src/shared/src.ts)

> This web feature is deprecated but is still supported in Safari.
