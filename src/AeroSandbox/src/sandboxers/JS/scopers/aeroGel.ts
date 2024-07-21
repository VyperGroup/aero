// TODO: Finish this and then make it the default. Make it possible to configure in the config.

// TODO: Use the Webpack val plugin to minify this code

export default str => /* js */ `
...

$aero.fakeWindow = Object.create(window);

Object.defineProperty(fakeWindow, "location", {
  get() {
    return fakeLocation;
  },
  set() {
    return fakeLocation;
  },
});

const winProto = Object.getPrototypeOf(window);
// Prevent detection by checking if the fakeWindow was inherited from the real window.
if ("__proto__" in fakeWindow)
    Object.defineProperty(fakeWindow, "__proto__", {
        get() {
            return Object.getPrototypeOf(window);
        }
    });
Object.defineProperty(fakeWindow, "getPrototypeOf", {
    get() {
        return () => winProto;
    }
});
// Prevent detection through the Function class
if (Object.hasOwn(Function.prototype, "arguments"))

var isStrict = (() => { return !this; })();

if (
  isStrict &&
 // Safely check, because of
  Object.hasOwn(Function.prototype, "arguments")
) {
  if ()
}

(() => {${str}}).call(
  // Changes \`this\` to be the window. This makes it act as if it is not scoped. This is because when you use a blocked-scope variable keyword (let or const) it is a part of the window, but not on the window object. This is the essence of scoping.
  fakeWindow
);
`;
