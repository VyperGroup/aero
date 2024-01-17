# aero's Sandboxing library Dev Docs

## How automatic API interception would work

The essence of API interception is parsing standard documents to create concealers, which are API interceptors

### WHATWG

1. Scan for every class

#### Example from the [Response class](BareClientExtenders)

response.url = ...
