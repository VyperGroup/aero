# Proposal for a new proxy extension system for proxy middleware

As it stands, the only way to extend API interceptors or extend rewriters in your proxy (extend proxy functionality or create new functionality) right now is to inject your own sandboxers into the response body. This is obviously tedious and should be avoided. Here is my new proposal.

Caveats:

* This would be an optional specification, because it requires a lot of work to implement into a proxy and it shouldn't be done inside of a Bare Client, although it is possible. I may make a [BCC](https://github.com/MercuryWorkshop/bare-client-custom) extension that works by injecting aero's sandboxers into the response body, but this would be very expensive due to there being two rewriters at once. The best option as a proxy dev is to adopt this specification.
* This would require the encompassing `extend_proxy` permission, or the two individual permissions `extend_proxy_interceptors` or `extend_proxy_rewriters`

## Intercepting

### Shared Types used in both the subheadings below

```ts
declare namespace MiddlewareTypes {
  /**
   * This is a modified version of the Project interface from the TompHTTP standards made to allow for identification and distinction of the proxy that will be used. For every property provided, the proxy itself would ensure that the property on the project matches. Basically detecting if sets intersect, but with objects. If ProjectSelector is not provided, it would work on any proxy, which is dangerous, since every proxy is implemented differently. If this happens, there will be a warning about this logged to the console.
  */
  export interface SupportedProjects {
    ...

    /**
     * The name of the supported projects.
     */
    names?: string[];

    /**
     * A descriptions of the supported projects.
     */
    descriptions?: string[];


    /**
     * The project's website supported.
     */
    websites?: string;

    /**
     * The  supported project's repository URL.
     */
    repositories?: string;

    /**
     * The short SHA-1 hash of the project's repository.
     * @see https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection
     */
    commitHashes?: string;

    /**
     * The current version of the project.
     * Consider this an alternative to the `commitHash` property.
     */
    versions: string;
  }

  ...
}
```

### Warning, if SupportedProjects is not provided

TODO: Write

### Interceptors

#### Example usage

```ts
redefineProxyInterceptor.open: MiddlewareTypes.createNewProxyAPI = API => {...},
extendProxyInterceptor.open: MiddlewareTypes.ExtendProxyInterceptor = {
  project: ...,
  handler(API, proxifiedAPI) {...}
}
```

> Basically in this example, these functions would overwrite the window.open API

#### Types

```ts
declare namespace MiddlewareTypes {
  ...

  /**
   * This will override whatever the rewriter is for the proxy
   * @param - The file to rewrite
   * @returns - The rewritten file
  */
  export type createNewProxyAPIInterceptor = (
    api: object
  ) => Proxy<object> | object

  export interface ExtendProxyInterceptor = {
    /**
     * The identification of the proxy. Same as the one from the bare meta. This is provided to specify, which proxy and the versions to run this code on.
     */
    project: MiddlewareTypes.SupportedProjects,

    /**
      * @param - The original API from the browser
      * @param - The API provided by the proxy's sandboxer
      * @returns The rewritten script
    */
    handler(API: object, proxifiedAPI: Proxy<object>) {...}: string {...}
  }
}
```

> This would be in [this file](./middleware/index.d.ts)

### Rewriters

#### Example Usage

```ts
/**
  * This will overwrite the listener for the proxy
  * @param - The script to be rewritten
  * @returns The rewritten script
  */
redefine.onScript: MiddlewareTypes.createNewProxyRewriter = script => {...},
extendProxy.onScript: MiddlewareTypes.ExtendProxyRewriter = {
  project: ...,
  /**
    * @param - The original script
    * @param - The script after being rewritten by the proxy
    * @returns The rewritten script
  */
  handler(scriptBefore, scriptAfter) {...}
}
```

#### Types

```ts
declare namespace MiddlewareTypes {
  ...

  /**
   * This will override whatever the rewriter is for the proxy
   * @param - The file to rewrite
   * @returns - The rewritten file
  */
  export type createNewProxyRewriter = (
    file: string
  ) => string

  export interface ExtendProxyRewriter = {
    /**
     * The identification of the proxy. Same as the one from the bare meta. This is provided to specify, which proxy and the versions to run this code on.
     */
    project: MiddlewareTypes.SupportedProjects,

    /**
      * This is usually to add new APIs that the proxy doesn't yet support.
      * @param - The original file
      * @param - The original rewriter function to the proxy
      * @returns The rewritten file
    */
    handler(fileBefore: string, fileAfter: string): string {...}
  }
}
```

> This would be in [this file](./middleware/index.d.ts)
