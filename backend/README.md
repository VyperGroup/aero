# What's this?

Here you may find alternative backends such as: server-only and webextension. This was made to provide ways to use aero rather than through a service worker, allowing aero to be used more efficiently in certain environments. **This is incomplete**.

# Backends

## Extension
Aero powered by WebExtensions. This is recommended if you are able to install extensions, so you don't have to worry about links being blocked. In most cases it is faster than traditional aero.

## Server
Aero powered by Cloudflare Workers with polyfills for Browser-like APIs. This is recommended for limited environments where SW's aren't viable, such as an older browser.