# How the new tests will work

These tests should be ran in all the browsers that browser quirks supports and in an untampered environment. There will be a [playwright](https://playwright.dev/) script for doing this headless, and the type of tests will be ran on every PR depending on what kind of files are edited. They will be ran in the 3 major browsers with the latest (dev) release.

- Standard Tests - This will test aero against web standards, such as [wpt](https://web-platform-tests.org/running-tests/from-web.html#) from W3 and WHATWG

  - There will be two iframes the first at exampleproxysite.com/aero/tests/standard tests/index.html and the second at

  ```sh
  exampleproxysite.com/$PROXY_PREFIX/$PROXY_URL_ENCODER("exampleproxysite.com/aero/tests/standard tests/index.html") (proxying itself)
  ```

  - If any of the checks fail in the second one that don't fail in the first one, that means that it can be counted out as lack of support from the browser or being blocked itself

- Browser Quirks - These will contain tests for different implementations for features that browsers implement differently. This includes APIs, such as the Error API. Most likely these will use tests from the browsers themselves.
- Proxy Quirks - These will contain common bugs across proxies that allow for detection that aren't related to the lack of support for an API. These are the only ones that I will have to implement myself.

> The benefit of not writing my own tests is that it is unrealistic for me to test everything, or have it extensive enough as an entire standard organization or browser development team can implement themselves
