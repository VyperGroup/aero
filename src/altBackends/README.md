# Alternative backends for aero

## What's this?

Here you may find dev work on alternative backends for aero such as: server-only and webextension. This was made to provide ways to use aero rather than through a service worker, allowing aero to be used more efficiently in diverse environments. These will support middleware eventually.

## Backends

## Extension

Aero powered by WebExtensions. This would be recommended if you are able to install extensions, so you don't have to worry about links being blocked. In most cases it would be is faster than traditional aero. This would simply be the handle.ts in aero ported to the web extensions API, rather than the SW.

## Server

### CF workers

Aero powered by Cloudflare Workers with polyfills and node implementations of JS apis with polyfills for Browser-like APIs. You will be able to choose how far back in browsing technology you want the browser to support. This may be useful if you want to use modern features in an old browser for nolstalgia purposes. This would be recommended for limited environments where SWs aren't viable, such as an older browser.
