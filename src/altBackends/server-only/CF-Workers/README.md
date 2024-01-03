# How ES2 browsers will be supported

Basically, you will be able to tell it what browser you would like to target and using canIuse.com

I am interested in going all the way back and supporting ES2

## How?

[Someone's Thoughts](https://web.dev/articles/the-end-of-ie)

- The user agents will be fooled
  Babel - Gets down to ES3. I would have to write my own Babel plugins to have ES2 support. See [ECMA History](https://www.educative.io/blog/javascript-versions-history)
- JS
  - Polyfill collections
    - [The most popular NPM Lib](https://www.npmjs.com/package/core-js?activeTab=readme)
    - [NPM Lib #2](https://github.com/JakeChampion/polyfill-library)
    - [NPM Lib #3](https://www.npmjs.com/package/babel-plugin-polyfill-es-shims)
    - [ES-Shims Org for ES3](https://github.com/es-shims)
    - [Bundle Website](https://polyfill.io/v3)
  - Extremely optimized specific polyfills
    - [unfetch for ES3](https://www.npmjs.com/package/unfetch)
  - Emulatd Web Workers
    - [Psuedo-worker](https://github.com/nolanlawson/pseudo-worker)
    - [worker-polyfill](https://www.npmjs.com/package/worker-polyfill)
    - [iframe-worker](https://www.npmjs.com/package/iframe-worker)
    - [nested-web-workers](https://www.npmjs.com/package/nested-web-workers)
  - RegExp's (This is a hard one)
  - [RegExp IE10](https://www.npmjs.com/package/regexp-polyfill)
  - [RegExp Flags](https://www.npmjs.com/package/regexp.prototype.flags)
  - [RegExp.escape ES7 for ES3](https://www.npmjs.com/package/regexp.escape)
  - ES2 supplemental transpilation for Babbel
    - [Switch Statements](https://www.npmjs.com/package/babel-plugin-transform-sequence-discriminants)
- CSS?
  - [Guide](https://ricostacruz.com/til/ie-polyfills)
  - [IE11](https://github.com/nuxodin/ie11CustomProperties)
- Video formats
  Newer video formats will be converted using [FFMpeg](https://www.npmjs.com/package/web-ffmpeg?activeTab=readme)
- PDFs
  - PDF.js will be injected into browsers that don't have a built-in editor

I will have the web proxy remember which sites require specific polyfills, to avoid performing compatibility testing each time a user accesses a website through the proxy. It would automatically maintain a database or a configuration file that maps websites to the corresponding polyfills required for compatibility. When a user requests a specific website through the proxy, it would checks the database or configuration file to determine which polyfills need to be injected.
