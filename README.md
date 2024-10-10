# aero

![aero logo](./aero.webp)

Aero is a safe, developer-friendly, innovative interception web proxy with many features. Aero provides full site support without delay and has a clean, organized codebase. Aero is made to bypass filter restrictions, web restrictions, and bypasses web browser restrictions.

I'm only quitting proxy dev once aero supports everything. AeroSandbox can sandbox everything (remove all web restrictions, too), and my Proxy Dev Guide is so detailed with examples that it contains explanations and code examples to make your proxy that supports everything.

## What is a web proxy?

Web proxies are website libraries that work to emulate the functionality of the site that you want. They do this by intercepting API calls and rewriting documents to emulate as if it was under the proxied origin.

Web Proxies can be used for:

- Bypassing any browsing restrictions in a sandbox
- Unblocking websites or browser features through emulation
- Middleware

## How to build aero

```bash
cd src/AeroSandbox
npm i
npm run buildSW
```

## How to live debug aero (how to run the aero dev server)

1. Install pm2
2. Execute these commands

  ```bash
  ./deps.sh
  npm run liveBuildSW
  npm start
  ```

> Run `git pull` and then run these commands again to update the dev server
> The port by default is :2525

### With VSCode

```bash
./deps.sh
```

In your editor: Press `f5` or `Menu -> Run -> Start Debugging`

### Notes

- You must run `pm2 restart <aero-build-watch/aero-sandbox-build-watch>` whenever you modify a compile-time Feature Flag for it to apply regardless if you are in a live build

## How to run unit tests

## Related

It is highly recommended that you install [aero middleware](https://github.com/VyperGroup/proxy-middleware) for enhanced functionality.

## Notable Contributions

- [Divide](https://github.com/e9x) for standardizing interception proxies with [TompHTTP](https://github.com/tomphttp/bare-server-node)
- [Percs](https://github.com/Percslol) for implementing Websocket support in aero
- [ThinLiquid](https://github.com/ThinLiquid) for the logo

Don't be afraid to help 😄
Nobody is unqualified to work on aero
Don't worry; you will figure out how aero works with our fantastic dev docs. Remember, if you have ideas for how to improve the docs, please suggest them
I appreciate all of you 💖
