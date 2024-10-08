# AeroSandbox SW Additions

SCRAP ALL OF THIS: LOOK IN CONTEXTUAL IDENTITIES.TS
TODO: Make it so that all files that end with swAdditions.ts are under tsconfig for SW

The bundle won't include the code for Nested SWs, but you should put this after the nested SW import.

How to implement:

Add

```js
importScripts("/aero/sandbox/swAdditions.js")
...
addEventListener("fetch", event => {
  const possibleResp = fetchEventMiddleware(event);
  if (possibleResp instanceof Response)
    return resp;
  ...
})
```

To your SW

## TODOs

- [ ] Use the types for the service worker specifically in this `aeroSWAdditions` folder and nowhere else in `src/AeroSandbox`
- [ ] Prevent the SW from killing itself, so that ...

### Specific additions

- [ ] Implement the backend in `self.fetchEventMiddleware` needed for `<controlview>.loadURL`. It will basically be an addition to the original prefix on the SW. Let's say the SW's prefix was `/go/`, loadURL would redirect the iframe's location to `/go/<ADDITIONAL PREFIX>/<ENCODED? PROXY URL>`. This is how it would know to add on the data in the query params. Interestingly, before the middleware sends off