# Live middleware update - Roadmap

Here is what needs to be worked on:

- [ ] WS/WRTC/WT support in the standard
- [ ] Live Middleware update - Allow users to add and modify Middleware on the fly with optional repo support. This will include a customizable UI for this. Possibly even a basic code editor with Monaco for simple changes.
- [ ] Middleware support in native HTML scripts for bookmarklets and userscripts
- [ ] Middleware BareClient mix-in - To support every interception proxy. This will simply involve porting the aero code to a modified BareClient.
- [ ] Middleware HTTP layer - Lowest priority; to support every proxy including server-only. A proxy that runs middleware made for backend proxies through a JS runtime

## UI

- [ ] A customizable middleware store front
- [ ] An UI that is more lightweight than the middleware store
- [ ] A Permissions popup
