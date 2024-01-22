# Index

## Glossary

- API Interceptors - These are ES6 Proxy objects whose job is to make the site as if the site is under another origin. This is where proxification is done.
- Concealers - These are API Interceptors whose only purpose is to hide the origin. These trick the site code into thinking that everything is normal. Concealers are not only needed to later on construct the correct requests, so that they can pass through the SW and be handled in the Bare Client, but they are also needed to prevent the site from thinking anything is abnormal. Our goal with web proxies is to emulate the original behavior of the site, so we need these for them to function.
- Revealers - These are the APIs or browser features that need to be concealed
- [Shim](<https://en.wikipedia.org/wiki/Shim_(computing)>)
- [Polyfill](<https://en.wikipedia.org/wiki/Polyfill_(programming)>)
- Backwards-polyfill - This refers to a polyfill whose purpose is to provide legacy APIs to modern browsers

> This section assumes that you have already read the [Glossary for aero](../../../docs/Index.md#glossary)

## Directory listing

- src/
  - API/ - This folder contains the optional features that AeroSandbox supports
  - cors/ - The code for cors emulation
  - interceptors/ - The code for aero's API interception
    - concealers/ - The API interceptors whose purpose is to hide the origin
    - events/ - The API interceptors that isolate the events to the proxy origin. It also handles clear events
    - location/ - The API interceptors that intercept redirection and conceal the origin
    - req/ - The API interceptors for requests
    - storage/ - The API interceptors that isolate the storage into the proxy origin
    - worker/ - The code to register nested SWs and API interceptors for workers
  - sandboxers/ - This contains the intereptors that intercept the actual code. They are synonymous with the "rewriter" code that you may see in non-interception proxies. They are faster and lighter than rewriters.
  - shared/ - This is code that is used in multiple other directories

## Scopers

TODO: Link to the scopers
