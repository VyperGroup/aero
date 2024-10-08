# How to find "violating APIs"

What I mean by violating APIs are APIs that need to be intercepted for whatever reason.

## To find APIs that make requests  a SW can handle



## To find APIs that make requests a SW can't handle

- [W3C]https://github.com/search?q=org%3Aw3c+NOT+is%3Afork+path%3A*.bs+OR+path%3A*.html+%22%5B%3Drequest%2Fservice-workers+mode%3D%5D%22+OR+%22%5B%3Dservice-workers+mode%3D%5D%22&type=code
- Due to protocol limitations, SWs can only handle HTTP requests, not Web Sockets or Web Transports so the JS APIs for those protocols are classified as such.

## An exception...

Syncronous XHR requests `XHRHTTPRequest.open(..., ..., false)` should be intercepted in a SW, in browsers that still support the [deprecated](https://xhr.spec.whatwg.org/#:~:text=in%20the%20process%20of%20being%20removed%20from%20the%20web%20platform) Syncronous XHR requests, however, they don't actually. This means that you need to use `bare-mux.fetch(...)` in a hook if the request is sync.