# Redirector interception - DRAFT 📝

## Navigation events-assisted

This removes the need for all of the redirector interceptors apart from the onhashchange event, substantially improving aero's speed

When enabled this will omit the code from the AeroSandbox bundle for intercepting the redirectors, such as:

- The href attribute for redirection purposes
- Modifying history states in the History API
- Modifying properties in the location API and the methods: assign() and replace()
- TODO: ... - There might be more?

## Traditional

> This is what aero uses at the moment

Right now aero intercepts the JS APIs to prevent the site from redirecting outside of the proxy site's origin
