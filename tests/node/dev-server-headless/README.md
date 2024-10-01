# Dev Server headless tests

This test will check if aero's SW runs, Bare-Mux works fine, and https://example.com works
It will work by spinning up the aero dev server and using Playwright to try to load `https://example.com` on it
It will also make sure no errors come up inside of the devtools log