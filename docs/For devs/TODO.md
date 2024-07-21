# TODOs

This is the main TODO file for changes that encompass every part of aero.

If you want to find something to contribute to, search in your editor for TODO comments and look in TODO.md files for milestones, or generalized ideas. This is how project management is done in aero.

- [ ] Instead of using comments at the end of properties to document, properly document the interface properties with `/** * */` (JSDoc)
- [ ] Finish AeroSandbox
- [ ] Make a Worker version of AeroSandbox (AeroSandbox but it only supports the [Web APIs that are present inside of Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers#:~:text=the%20following%20web%20apis%20are%20available%20to%20workers%3A))
- [ ] Nested SW support
- [ ] Completely move any remnants of middleware to the proxy-middleware repo and instead recommend the users to reference that repo for the middleware in the docs.
- [ ] Move everything from [src/shared](../../src/shared/) to the AeroSandboxing library as general utilities.
- [ ] Implement optional url encoding like UV (this will be recommended against)
- [ ] URL hash encoding support (this will be default)
- [x] Make a new global aero logging method at $aero.log
- [ ] Make aero the first quad-threaded proxy: switch to bare-mux 2.0 and SharedWorker-based rewriting
- [ ] Finish the .val.ts building convention and write about in a doc
- [ ] Fix import paths
  - Use TSConfig paths for every path. No mor ee relative paths. This will help for clarity and if I ever want to move around where the folders are located in a future refactor.

## Build System

- [ ] Revert back to using Biome and Rspack
- [ ] Publish builds on NPM
  - [ ] AeroSandbox
  - [ ] Backend-only aero
- [ ] Make server-only builds
  - [ ] winter.js
  - [ ] CF Workers
- [ ] Make builds of aero that are made for older browsers

## Commit Renames

- [ ] Remove the "- DRAFT" from the filenames (still keep them in the README.md headings)

## Docs

- [x] Convert all of the TODO.xit files to MD
- [ ] Properly capitalize the headings in the docs
- [ ] Migrate all of the proposals to conform with my new standards
- [ ] Create docs for docs.vyper.group
- [ ] Convert the aero logo into an SVG
- [x] Get a new aero logo

### Comments

- [ ] Cite every web standard referenced (this will take a while)
- [ ] Finish JSDoc annotations (this will take a while)

## Issues

- [ ] Fix HTTP and STS Emulation

## Config

- [ ] Seperate the package.json for middleware. Then, cleanup the package.json.
- [ ] Provide auto-builds
- [ ] Provide environment config files for the Helix editor

## Aero Config

- [ ] Implement url encoding like UV

## Bare Client

- [x] Move all of the middleware code into a bare-mux transport
- [ ] Support bare-mux
