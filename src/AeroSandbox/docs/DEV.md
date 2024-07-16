# AeroSandbox library Dev Docs

## Storage Isolation

Isolating the cookies to a certain key. In the case of a proxy, this would likely be the proxy origin itself.

```ts
createAeroSandboxBundle({
  storageId: `Your key here`,
  ...
});
```

## How to write an API Interceptor for AeroSandbox

TODO: This is a stub...

```ts
export default {
  proxifiedObj: new Proxy(Blob, {
    apply(target, that, args) {
      const [arr, opts] = args;

      if (isHtml(opts.type))
        args[0] = arr.map((html: string) => $aero.init + html);

      let ret = Reflect.apply(target, that, args);

      let size = 0;

      args[0].forEach((html: string) => (size += html.length));

      ret.size = size;

      return ret;
    },
  }),
  apiName: "Blob",
  availableInWebWorkers: true,
};
```
