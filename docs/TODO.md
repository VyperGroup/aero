# TODOs

This is the main TODO file for changes that encompass every part of aero.

If you want to find something to contribute to, search in your editor for TODO comments and look in TODO.md files for milestones, or generalized ideas. This is how project management is done in aero.

- [ ] Instead of using comments at the end of properties to document, properly document the interface properties with `/** * */` (JSDoc). - Russel9000 (on Discord) plans to work on this.
- [ ] Finish aero's sandboxing library
- [ ] Nested SW support
- [ ] Completely move any remnants of middleware to the proxy-middleware repo and instead recommend the users to reference that repo for the middleware in the docs.
- [ ] Move everything from [src/shared](../../src/shared/) to the AeroSandboxing library as general utilities.
- [ ] Implement optional url encoding like UV (this will be recommended against)
- [ ] URL hash encoding support (this will be default)

## Commit renames

- Change instances of "doc" to "article"

## Docs

- [x] Convert all of the TODO.xit files to MD
- [ ] Properly capitalize the headings in the docs
- [ ] Migrate all of the proposals to conform with my new standards
- [ ] Create docs for docs.vyper.group

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

## BareClient

- [x] Move all of the middleware code into a Bare V4 transport
- [ ] Support BareClient V4
