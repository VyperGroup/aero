# ForwardCompat

This will be a proxy middleware, primarily intended to be used with the backend-only version of aero, since running a proxy client-side on extremely old browsers is demanding. It will allow modern websites to function on browsers as old as Netscape Navigator 3 and IE6. It will transpile to ES2 with Babel (Only goes down to ES3 by default) and a lot of plugins, automatically inject a plethora of polyfills using the middleware, and converting media files into ones that older browsers can understand through the middleware as well.

## How ES2 browsers will be supported

I am interested in going all the way back and supporting ES2 based browsers, such as old Netscape and IE6.

## Open-ended Questions

### Why?

This is one of my favorite ideas yet, however it is really Novel. It makes me really happy though. It also demonstrates the true power of web proxies that is unrealized.

### Why is it called that?

This is a play on words for backwards compatibility. Normally sites use this type of technology to support old browsers on their websites. This does the reverse, and forces the site to use this technology but to the extreme. Specifically, to however the browser needs it the most. If you already understand how web proxies are classified, you could think of this to a "Forward Proxy" rather than the original "Reverse Proxies" but in the context of backwards compatiblity.

### How?

[Polyfills](https://web.dev/articles/the-end-of-ie)

As I finish a task I will remove the its bullet point

- The user agents will be fooled to a modern browser
  Babel - Gets down to ES3. I would have to write my own Babel plugins to have ES2 support. See [ECMA History](https://www.educative.io/blog/javascript-versions-history)
- JS
  - Polyfill collections
    - [NPM Lib #2](https://github.com/JakeChampion/polyfill-library)
    - [NPM Lib #3](https://www.npmjs.com/package/babel-plugin-polyfill-es-shims)
    - [ES-Shims Org for ES3](https://github.com/es-shims)
    - [Bundle Website](https://polyfill.io/v3)
  - Extremely optimized specific polyfills
    - [unfetch for ES3](https://www.npmjs.com/package/unfetch)
  - Emulated Web Workers (We have many options)
    - [Psuedo-worker](https://github.com/nolanlawson/pseudo-worker)
    - [worker-polyfill](https://www.npmjs.com/package/worker-polyfill)
    - [iframe-worker](https://www.npmjs.com/package/iframe-worker)
    - [nested-web-workers](https://www.npmjs.com/package/nested-web-workers)
  - RegExp's (This is a hard one)
    - [RegExp.escape ES7 for ES3](https://www.npmjs.com/package/regexp.escape)
    - [RegExp IE10](https://www.npmjs.com/package/regexp-polyfill)
    - [RegExp Flags](https://www.npmjs.com/package/regexp.prototype.flags)
    - For even older browsers, I will have to make my own RegExp class from scratch
  - ES2 supplemental transpilation for Babbel
    - [Switch Statements](https://www.npmjs.com/package/babel-plugin-transform-sequence-discriminants)
- CSS?
  - [Guide](https://ricostacruz.com/til/ie-polyfills)
  - [IE11](https://github.com/nuxodin/ie11CustomProperties)
- Video/Audio codecs / Older mage formats
  Unsupported codecs and older image formats will be converted using [FFMpeg](https://www.npmjs.com/package/web-ffmpeg?activeTab=readme)
- Semi-modern image support
  - [For semi-older browsers that don't support external svgs](https://github.com/thasmo/external-svg-polyfill)
- Fonts
  - TTF/WOFF fonts will be converted to EOT for IE8 support
  - For browsers that don't even support EOT let alone TTF/WOFF, the fonts will be prerendered into an image. This means that the text in custom fonts will be displayed as an image with invisible text behind it, so that it can be highlighted and copied and pasted. This will also be done with web-safe (default) fonts that weren't included at the time the browser was created. Some possible libraries I will probably use [ultimate-text-to-image](https://github.com/terence410/ultimate-text-to-image).
- PDFs
  - [PDF.js](https://mozilla.github.io/pdf.js) will be injected into browsers that don't have a built-in editor

### Wouldn't repeated detection be slow?

I will have the web proxy remember which sites require specific polyfills depending on what polyfills the browsers need by using [BrowsersList](https://browsersl.ist/), to avoid performing compatibility testing each time a user accesses a website through the proxy. It would automatically maintain a database or a configuration file that maps websites to the corresponding polyfills required for compatibility. When a user requests a specific website through the proxy, it would check the database or configuration file to determine which polyfills need to be injected. It will also only inject polyfills that are needed for the specific browser.

### (Insert site here) doesn't work

Make a PR