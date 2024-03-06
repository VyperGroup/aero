# TODOs

- [ ] Publish AeroSandbox to NPM. There will be specific builds for specific features for tree-shaking purposes. I'm trying to make AeroSandbox a seperate library for stability, portability, and a lower bundle size.

- [ ] Implement auto api interception
- [x] Deprecate autoProxy. It's a dumb gimmick originally made to save me from keystrokes. I will still keep the strings method. I will rename autoProxy to strings proxy
- [ ] In html.ts, instead of keeping an attribute to mark the element, store them in a WeakMap, so they can automatically be cleaned up by the garbage man
- [ ] Move all of the middleware code into a modified BareClient
- [ ] Seperate the package.json for middleware. Then, cleanup the package.json.
- [ ] Provide auto-builds
- [ ] Implement url encoding
- [ ] Support Safari (Read Faq for more info)
- [ ] Fix HTTP and STS Emulation
- [ ] Support XML/XSLT documents
- [ ] Aero sandboxing library
- [ ] Support nested SWs

- [ ] Migrate the HTML Rewrites to the the rewriting rules
- [ ] URL Encoding / Hash support

## HTML Rewriting

## API Support

- [ ] Support proxifying MutationEvents (deprecated), before they are removed from Chrome soon - <https://w3c.github.io/uievents/#interface-mutationevent>
- [ ] Support the FLoC APIs
- [ ] The FetchLater API
- [ ] TODO: Add more draft/experimental/origin trial APIs to the list
