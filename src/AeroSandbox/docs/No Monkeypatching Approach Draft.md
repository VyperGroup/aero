# No Monkeypatching Approach 📝

Right now, aero unsafely overwrites all of the APIs by default and hardcodes whether they are deprecated or supported in a certain way (Origin Trials for a certain browser, Non-major browser support, Draft stages, etc...)

This will allow for selectively choosing, which APIs to support

## Code example

```ts
// apiName, Proxy<any>
// The API Names will be the property that will be overwritten in the window by the bundle scripts
type Name = Map<string>;

const exportedAPIs: Name = new Map("Fetch", ...)

export default ;
```

## Support detection

Aero's Webpack code will assume the responsiblity of checking the aero flags for a [certain](TODO: Link to the flags bitwise enum in the index.d.ts for AeroSandbox) [bitwise enum](../../../docs/For%20devs/Philosophies%20of%20aero.md) to [categorize](#categorization) the APIs in terms of support.

### Categorization

Depending on the value of the bitwise enum, it will query caniuse's SDK to determine if the bit flags match up. Additionally, I will need to query the individual sites for the current Origin Trials.

### Tree shaking

Additionally, I no longer want any aero flags to be featured inside of the bundle code. I want everything to be able to be tree-shaken out.

### Support categories

## Considerations

- This will also make it easier to be understood by other and implemented in their own buildsystem with their own ways.
