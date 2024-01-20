# How the build system works

The build system supports [Webpack](https://webpack.js.org) and Webpack-like loaders ([Rspack](https://www.rspack.dev) by ByteDance)

## The bundles that are built

TODO: ...(list them and how to use them)

## How eval strings are packed

I use the WebPack plugin [val-loader](https://webpack.js.org/loaders/val-loader) for this. Any file that ends in `.val.ts` is loaded with it. This helps reduce the bundle size that is actually used in the proxied website's content.

### Syntax Highlighting

For styling purposes, template strings are tagged with:

```js
/* <language> */ `...`;
```

Make sure that your editor is properly configured to display the inline code properly

> I haven't yet figured out a way to use prettier with them. I might have to develop my own plug-in for this purpose.
