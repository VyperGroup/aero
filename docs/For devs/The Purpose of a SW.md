# The purpose of a service worker

Service workers are not actually needed for developing a proxy that rewrites on the server. Infact, there's many [reasons](../../src/SW-less/README.md) why a service worker might not be a viable use case for you. That's why I developed [SW-less](../../src/SW-less/README.md). Service workers are recommended for proxies, because they are performant and they prevent the need to hook into browser features that perform network requests, which makes [request interception](./Request%20Interception.md) easier. 
