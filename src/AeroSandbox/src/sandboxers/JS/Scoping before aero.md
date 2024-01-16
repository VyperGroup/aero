# JS Rewriting-based Scoping

> I by no means recommend this method. If you are a beginner with proxies, I don't recommend reading this. This method is unnecessarily complicated and slow. Consider anything below a bad practice.

## AST-based parsing

Traditionally proxies have parsed the JS and whenever there was a reference to the location identifier they would replace it with their own location object. This is slow because it parses the entire JS library. It doesn't have to be this way!

### Partial proxing

This only parses references to variable name and property trees. If it suspects something of being a reference to aero, it will wrap it in a function to check it. When I say wrapping, it means putting the identifiers inside of a argument for the checker. In aero's case it is `$aero.check`. Under [certain conditions](#conditions-required-to-wrap), it does not wrap.

### Conditions required to wrap

The parser has to keep track of strings, their escapes, and the templates for template strings (it needs to get what it insine). If the current character is a part of a string, it won't qualify for variable checkng

1. It will check an entire object with its bracker property accessors
2. Whenever there is an equals sign, it will wrap whatever is after up to a: ;, \n, or ) (in the case of default parameters)

### How it wraps

Whenever there is a character, while iterating over the string as an array, it records the index of the array to a variable.
Along the way, it keeps track of what it is to determine if a It does this in multiple ways, because there are different ways of naming a variable:

It needs to keep track of whatever is inside of the [binding list]()

Because of functions parameters and default parameters, if the variable is inside of parenthesis when it is after the equals operator of a variable and before the.

> `var x = ...;`

#### Reaching the end of a statment
