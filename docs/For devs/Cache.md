# Cache

## Cache Emulation

HTTP caches are emulated by a system using aero's service worker's own cache stores. This allows caches stored for a specific origin, rather than apply to the whole site with the real header. Another reason why this is needed is, because Clear-Site-Data deletes every origin's cache making aero otherwise detectable.

TODO: Document how it works

## Cache Manifest Rewriting

aero rewrites the paths in the cache manfiests files using the [src rewriter](../../src/shared/src.ts)

> This is web feature is deprecated, but is still supported in Safari.
