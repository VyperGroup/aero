# Request interception

## HTTP

Interception proxies primarily intercept HTTP requests through a service worker, where the request is modified and eventually sent using a [bare client](https://github.com/tomphttp/bare-client). The response will be rewritten and cache will be emulated. This prevents the need to hook into code that previously needed to be rewritten to redirect requests saving time and resources.

### How the response is rewritten (in psuedocode)

If

- the request is to navigate to a website, the sandbox injects aero's sandboxing library
- the request is to a JS file. it is [gelled](../../src/AeroSandbox/docs/JS/Scoping.md#aero-gel)
- the request is to a cache manifest, the paths are rewritten with the html src rewriter being reused. That is why it is seperate from rules.ts, where most of the attribute rewriters are stored.
-

### Emulation required

- [Cache emulation](./Cache%20Emulation.md).
- [Security Policy emulation](./Security%20Policies.md)

## WS

The WebSockets are to be handled by the [bare client](https://github.com/tomphttp/bare-client)

## WebRTC

It was a common misconception for a long time that WebRTC's were a major obstacle for proxies. WebRTC's turn protocol, made for NAT traversal, essentially already functions as a proxy. Besides, any schools block WebRTC completely, which makes streaming and conference calls broken. There is only two things that can be done for this with proxies, emulating this in WS or HTTP. The format is obviously the best option, because HTTP's protocol is nowhere near related to WebRTC's channels. WS's tunnels similar to data channels in many ways.

TODO: In Bare V4, propose this idea
