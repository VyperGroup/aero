# Index - DRAFT 📝

I must document what to do for specific APIs because the comment annotations are good enough. TODO: This is a work-in-progress document...

TODO: List the documents here

## For security

- You need to delete any APIs you don't have currently proxified. Leaving anything open to reveal your proxy makes it easier for the sites being proxied to block your users, and the fact that they know you are using the proxy lets them fingerprint you more easily. For the location APIs such as History and window.location, your users could get redirected outside the proxy and become deanonymized if you don't proxify them.

## For clarity and safety

- Ensure that you are using the proper global object when overwriting APIs.
  - When writing an API interceptor only available to clients, use `window` as the global object. Although you could use `globalThis,` `WindowProxy,` or `self,` you risk accidentally running the wrong interceptor in the context. You would want the error to throw if you need to do what you should. When you use these alternative global objects, TS will not know if your code is meant to be run in a client or a worker and fail to throw the error. You should use `window` for client-side code and `self` for worker-side code.
