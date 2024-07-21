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
