# aero's Sandboxing library

This is a soon to be proxy-independent library that lets you modify. It will work even without SW capabilities. This is where all the non-sw code of aero lays.

## It will let you

- [Freezing or faking element states](./docs/Faker%20API.md). This will trick the DOM APIs into thinking that the element still exists or with different properties than what it actually has, but in reality there is only a copy made of it that has been removed or modified from the dom and cloned to the shadow DOM. You can also put dummy elements. This allows Adblock to be completely undetectable. It also allows panels to be injected without allowing the site detect the use of them. It will also serve the base of my middleware html ui.
  - Adding on to use case, you will soon be able to [intercept HTTP requests without a Service Worker](./src/SW-less/README.md) and get back mock responses, making the browser think that there is no asset blocking. Soon, you will be able to bring back your MW2 extensions from your dead using injected scripts combined with this library. I will provide polyfills for these removed APIs that you can import in your extension.
- Intercept redirects, so that you could provide logging or link checking. A real world example is that many social media sites change the href to be a link checker that processes the url, before finally redirecting. They usually do this to warn the user that they are leaving the site (to mitigate phising attempts) or check the link on something like VirusTotal. Google search does something similar where when you click on the links you are first redirected to an endpoint for analytics purposes.
- Speed up your proxy by not parsing, turning it into an interception proxy, rather than a semi-interception proxy. You will be able to [patch other proxies to take advantage of the sandboxer's capabilities](#shims-for-alternative-proxies)

## Shims for alternative proxies

I will provide built files that can be imported into other proxies to replace their default modules

> The proxies that will be supported are: UV, Wombat (library used by Womginx and Pywb), Rammearhead

### Build patterns

They will be stored with this pattern: build/`proxy name`/`files`
In order to shim them easily, there will be git patch files for the respective proxy repos at build/`proxy name`/shim.patch

## Maintainability / Futureproofing

This library directly parses standards for conealers, so you can ensure that most API interceptors will keep up with the latest specifications. Unless there is a major enough change when it comes to how requests are made. It will parse the documentation and the WebIDL files.
