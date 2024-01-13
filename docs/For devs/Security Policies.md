# Security Policies

## CORS

Unlike other proxies that ignore the cors policy (delete them), aero abides by the intended security feature. Without these, sites can infer either the browser doesn't support modern security standards or that a proxy is being used. 

### Testing

It does this by sending the unproxied request and checking for a CORS error back.

If `corsMode` is unset, it will default to `testing`, but if url encoding is set (`urlEncoder`), it will instead default to CORS Emulation.

> This is the only CORS method that doesn't use emulation

### Emulation

Although [Testing](#testing) is useful, it reveals the URL, which defeats the purpose of URL encryption or obfuscation that may be in place. If you want to use CORS Emulation. set `corsMode` to `emulation`

## Sub-resource Integrity Emulation

This requires cooperation with the HTML rewriter or interceptor and the service worker.