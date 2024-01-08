# aero

Aero is a safe, developer friendly, and innovative interception proxy with many features. Aero provides full site support without much delay, while also having a clean and organized codebase.

## Related

A deployable version can be found [here](https://github.com/ProxyHaven/aero-deploy)
It is highly recommended that you install [aero middleware](https://github.com/ProxyHaven/Middleware) for enchanced functionality.

## Read the docs

You can find the documentation in /docs. If you are not a proxy site dev or a contributor, you don't need to read the docs under "For devs only"
Soon the Markdown files will be removed from AeroGit and put into Obsidian.md
You could always [email me](mailto:inbox@ryanwilson.space) with questions. You will never be denied support

## Directories

- **altBackends** - Alternative backends rather than using a SW
- **src/BareClientMixins** - Alternative Bare Clients. This code makes any of the code used in aero able to be ran inside of other proxies to prevent creating a properietary ecosystem on accident. See [BareClientMixins](./src/BareClientMixins/middleware/README.md) for more info.
- **src/BareClientsMixins/middleware** - The middleware code
- **src** - Aero's _actual_ code
- **src/this** - The SW code (aero's base). Alternative backends are found in _backend_.
- **src/sandbox** - Code that is injected into the site. This consists of API interceptors. This will transition to becoming the aero sandboxing library to become proxy independent. This is why the name was recently changed from browser to sandbox.
- **src/worker** - Basically, browser but for [nested workers](./src/nestedSWs/README.md)
- **src/shared** - Code used by _this_ and _browser_
- **backend** - Alternative aero backends (Non SW) for certain environments
- **tests** - Unit testing
- **dist** - Build files for aero. This is what you actually need to use aero on your site. These won't be present until you run `pnpm run build`.

## Notable Contributions

- [Divide](https://github.com/e9x) for standardizing interception proxies with [TompHTTP](https://github.com/tomphttp/bare-server-node)

Don't be afraid to help 😄
Nobody is unqualified to work on aero
Don't worry, you will figure out how aero works with our amazing dev docs. Remember if you have ideas for how to improve the docs, please suggest them
I appreciate all of you 💖
