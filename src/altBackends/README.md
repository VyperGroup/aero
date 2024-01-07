# Alternative backends for aero

## What's this?

Here you may find dev work on alternative backends for aero such as: server-only and webextension. This was made to provide ways to use aero rather than through a service worker, allowing aero to be used more efficiently in diverse environments. 

## Backends

## Extension

Aero powered by WebExtensions. This would be recommended if you are able to install extensions, so you don't have to worry about links being blocked. In most cases it would be is faster than traditional aero. This will simply be the handle.ts in aero ported to the web extensions API, rather than the SW. On MV2 versions, there will be a toggleable button that uses [declarativeNetRequest](x) to intercept all urls and responds with aero injected, for ease of use. In the future, I will make a web extension for Web Recorder independent from proxying.

## Server

I am not interested in porting aero to other backends, due to the maintenance it requires. Besides,server-only aero is discouraged due to [SW-less](x).

### CF workers

CF Workers support will be the 

#### Other JS runtimes

You can use Wrangler to run the CF Workers version anywhere

If you want to run aero in server-side JS, you can use the [server-side version of SW-less](x).
