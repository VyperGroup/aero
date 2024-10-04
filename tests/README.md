# aero's unit tests

Aero should never be published to NPM or this code merged to `main` from `unstable` if any of the unit tests fail.

The tests will be processed in this order

1. Node tests
  1. Package
  2. Dev-server headless
2. Browser (AeroSandbox) tests
  ...