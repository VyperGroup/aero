# Proxy Middleware - Dev Docs

> Soon these docs will become an official standard

## Permission system

When a middleware is first installed, the user will have the option to grant permissions it asks for with checkboxes (ike Discord's Oauth). The user will be able to grant the permission in the middleware UI later. When an API that requires a permission to be used and it is denied, the user will be checkbox, with a popup, to allow it, under the button that says no, there will be a checkbox that says "Don't ask again. Additionally, the user may set the number of times before the same prompt will show the checkbot, in the middleware UI.

Heres how the permissions system would work inside of a middleware handler.

The API will simply be a method that returns the actual API as a promise, if not, it will false, which must be handled.

sync (blocking)

```ts
const <API_NAME> = await ctx.apis.<API>()
if (!<API_NAME>)
  ...(handle exception)

```

### An "encompassing permission"

This means that there is a "master" permission that grants a few other permissions along with it

## Network request proxying

The permission, "network_requests" must be enabled, in order to wt, fetch, ws, and wrtc. Those APIs will be overriden inside of the scope of the middleware.

## modifySelf

This was created so that the middleware could support live editing. In order for this API to work, the permission `modify_self` must be granted. I will eventually, make different web bundler backends. This is a form of eval.

API example usage

```ts
type modifier = (script: string) => string
ctx.apis.modifySelf(<Type of middleware enum>, modifier)
```

If it is a minified file and min.js files are provided in the Zip that correspond to the name of the handler files, they will be used to recreate the deobfuscated scripts. You will be able to choose which minifier would be used after the file is saved. Also when the file is saved, if it is Webpack, webcrack will be used to debundle, and when it is saved, it will be repacked.

## Adapters

Perhaps, you may want to communicate between different middlewares. This is called shared data.

Shared data requires the permission `shared_data`. This allows data to be written and read. You may also manually grant `shared_data_send` and `shared_data_recieve` instead for thr respective scripts.

In any storage key or message channel that works in Web Workers, the storage key or message will have `MW_<Identifier>_`. This prevents the storage key from conflicting with the SW and other middleware, which would otherwise be a security risk. If you want to share between all other MW, you will have to prefix your key with `SHARED_...`. If you want to only share it with certain middlewares, you must write `SHARED_TO_<JS array of Identifier>_...`.

> The identifier comes from the manifest itself

## Bridge (fake middleware)

fakeMiddleware is a low level API that allows middleware to create. In order for it to be used the permission must be granted by the user, "fake_middleware".

Regardless of the type of handler you are in, you can call

```ts
ctx.apis.fakeMiddleware.register(manifest);
```

Events example

```ts
type FakeMiddlewareEvents = "enable" | "disable" | "delete" | "optionChanged";
// In the middleware UI
ctx.apis.fakeMiddleware.register(event: FakeMidewareEvents)
// In the bridge
ctx.apis.fakeMiddleware.dispatchEvent(event)
```
