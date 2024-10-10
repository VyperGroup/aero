# TODOs

This is the main TODO file for changes that encompass every part of aero.

If you want to find something to contribute to, search in your editor for TODO comments and look in TODO.md files for milestones, or generalized ideas. This is how project management is done in aero.

- [ ] Instead of using comments at the end of properties to document, properly document the interface properties with `/** * */` (JSDoc)
- [ ] Finish AeroSandbox
- [ ] Write a handler for Rust (handleRust.rs)
- [ ] Make a Worker version of AeroSandbox (AeroSandbox but it only supports the [Web APIs that are present inside of Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers#:~:text=the%20following%20web%20apis%20are%20available%20to%20workers%3A))
- [ ] Nested SW support
- [ ] Move everything from [src/shared](../../src/shared/) to the AeroSandboxing library as general utilities.
- [ ] Implement optional url encoding like UV (this will be recommended against)
- [ ] URL hash encoding support (this will be default)
- [ ] Make aero the first quad-threaded proxy:
  - [ ] switch to bare-mux 2.0
  - [ ] SharedWorker-based rewriting
- [ ] Finish the .val.ts building convention and write about in a doc
- [ ] Use `import type` when importing types

## Security

- [ ] Escape fatalErr with the flag `EXTRA_SECURITY_ESCAPE_ERR` and [Mozilla's sanitizer-polyfill](https://github.com/mozilla/sanitizer-polyfill)

## Unit Testing

- [ ] Set up unit tests for the SW using [Miniflare](https://github.com/cloudflare/workers-sdk/tree/main/packages/miniflare#quick-start). It will work by using `dispatchFetch` and with a traditional unit testing library expect certain responses back which correspond with the site's elements and headers. I already have made individual unit tests for some modules and API interceptors, but your SW handler itself might be broken.
- [ ] Setup testing for the location API interceptors with the goal being to detect the actual location instead of being `https://example.com` or changing the fragment url to `#fail-<the-failed-test-name-here>` and the `onhashchange` event detects that

## Build System

- [x] Publish builds on NPM
  - [x] AeroSandbox
  - [ ] Server-only aero `aero-proxy/<winterjs/cf-workers>`
- [ ] Make server-only builds
  - [ ] winter.js
  - [ ] CF Workers
- [ ] Make builds of AeroSandbox that are made for older browsers (to be paired with server-only aero)
- [ ] Add pnpm support

## API Interceptor system

- [ ] Finish the import code for the API Interceptors (init.ts in AeroSandbox)
- [ ] Set the default import level to be one and bump the existing import levels of one
- [ ] In debug mode, use console.table to log the status of the API interceptors loaded

## Commit Renames

- [ ] Remove the "- DRAFT" from the filenames (still keep them in the README.md headings)

## Docs

- [ ] Provide better examples in the JSDoc and for internally used libraries say where it is used inside of aero's codebase.
- [ ] Finish JSDoc for all exported methods
- [ ] Add a deploy to CF Workers button for server-only aero with CF Worker support
- [ ] Setup the build scripts work with IDEs (Zed and VSCode by clicking the run button using a launch.json)
- [ ] Properly capitalize the headings in the docs
- [ ] Migrate all of the proposals to conform with my new standards
- [ ] Convert the aero logo into an SVG

### Comments

- [ ] Cite every web standard referenced (this will take a while)
- [ ] Finish JSDoc annotations (this will take a while)

## Issues

- [ ] Fix HTTP and STS Emulation

## Config

- [ ] Provide auto-builds
- [ ] Provide environment config files for the Helix editor

## Aero Config

## Bare Client

- [x] Move all of the middleware code into a bare-mux transport
- [ ] Support bare-mux

## Improving experience on code editors

### Task running

- [ ] Make tasks for running aero/AeroSandbox's tests and output to the code editor

> Make three tasks for: just aero, just AeroSandbox, and combined