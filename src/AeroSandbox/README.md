# aero's Sandboxing library

This is a soon to be proxy-independent library that lets you modify. It will work even without SW capabilities. This is where all the non-sw code of aero lays.

## It will let you

- Freezing or faking element states. This will trick the DOM APIs into thinking that the element still exists or with different properties than what it actually has, but in reality there is only a copy made of it that has been removed or modified from the dom and cloned to the shadow DOM. You can also put dummy elements. This allows Adblock to be completely undetectable. It also allows panels to be injected without allowing the site detect the use of them. It will also serve the base of my middleware html ui.
  - Adding on to use case, you will soon be able to intercept HTTP requests without a Service Worker and get back mock responses, making the browser think that there is no asset blocking.
- Soon, you will be able to bring back your MW2 extensions from your dead using injected scripts combined with this library. I will provide the old APIs in a bundle that you can import in your SW.
- Speeds up your proxy by not parsing, turning it into an interception proxy, rather than a semi-interception proxy.
- Easily port new proxies. I will be porting Rammerhead to become an interception proxy, and along with my SW-less runtime for proxy, I will use this in place of it's own API interceptors and HTML Rewriting. This will be a stepping stone before aero releases (something for my users to use while I keep them waiting),
- Intercept redirects, so that you could provide logging or link checking. A real world example is that many social media sites change the href to be a link checker that processes the url, before finally redirecting. They usually do this to warn the user that they are leaving the site (to mitigate phising attempts) or check the link on something like VirusTotal. Google search does something similar where when you click on the links you are first redirected to an endpoint for analytics purposes.

## Maintainability / Futureproofing

This library directly parses standards for conealers, so you can ensure that most API interceptors will keep up with the latest specifications. Unless there is a major enough change when it comes to how requests are made. It will parse the documentation and the WebIDL files.
