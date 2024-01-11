# JS Scoping

## AST-based parsing

Traditionally proxies have parsed the JS and whenever there was a reference to the location identifier they would replace it with their own location object. This is slow because it parses the entire JS library. It doesn't have to be this way!

## Partial proxing

This only parses references to variable name and property trees. If it suspects something of being a reference to aero, it will wrap it in a function to check it. When I say wrapping I mean putting the entire   A checker refers to a function that. In aero's case it is `$aero.check`. 

Here's when it checks a variable

1. It will check an entire object with its bracker property accessors
2. Whenever there is an equals sign, it will wrap whatever is after it up to a: ;, \n, or ) (in the case of default parameters)

The parser has to keep track of strings, their escapes, and the templates for template strings. Aero does this by.

## Aero Gel (failed experiment)

This would've never taken off, because it introduces a lot of overhead

TODO: Bring back this from the old aero docs