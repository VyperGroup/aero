# The purpose of a service worker

Service workers are not actually needed for developing a proxy that rewrites on the server. Infact, there's many [reasons](../../src/SW-less/README.md) why a service worker might not be a viable use case for you. Service workers are recommended for proxies, because they are performant and they prevent the need to hook into browser features that perform network requests, which saves development time. 

## Request interception

### HTTP

Interception proxies primarily intercept HTTP requests through a service worker, where the request is modified and eventually sent using a [bare client](https://github.com/tomphttp/bare-client). The response will be rewritten and cache will be emulated. This prevents the need to hook into code that previously needed to be rewritten to redirect requests saving time and resources. Service workers are also a crucial part to aero's [cache emulation](./Cache%20Emulation.md).

### WS

The WebSockets are to be handled by the [bare client](https://github.com/tomphttp/bare-client)

### WebRTC

It was a common misconception for a long time that WebRTC's were a major obstacle for proxies. WebRTC's turn protocol, made for NAT traversal, essentially already functions as a proxy. Besides, any schools block WebRTC completely, which makes streaming and conference calls broken. There is only two things that can be done for this with proxies, emulating this in WS or HTTP. The format is obviously the best option, because HTTP's protocol is nowhere near related to WebRTC's channels. WS's tunnels similar to data channels in many ways.

TODO: In Bare V4, propose this idea

## CORS

Before aero, proxies used to ignore (delete) the CORS headers, rather than try to comply

### CORS Testing

### Sub-resource Integrity

This requires cooperation with the HTML Rewriter and the service worker.