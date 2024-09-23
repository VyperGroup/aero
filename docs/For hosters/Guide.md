# How to add aero to your proxy site

This is everything you need to add aero to your proxy site!

1. Use the [proxy SDK](https://github.com/vortexdeveloperlabs/sdk) for aero's handler and registering the SW [*example*](https://github.com/vortexdeveloperlabs/aero-demo-site/blob/main/sw.js#L4-L6)
2. Add the required NPM packages: `npm i aero-proxy`
3. Modify `examples/install-aero.sh` to your liking and include it inside of the root of your git repo. I recommend making a `deps.sh` in your repo like this:

```sh
# Your bash variables here
$AERO_PATH=... # The directory where aero's files should be
...

./node_modules/aero-proxy/examples/install-aero.sh
```

> You must set `$AERO_PATH` for this script to work; ⚠️ this will clean out the entire directory so don't put anything else in it

> Optionally, you may also set these bash variables: `$YOUR_CONFIG_PATCHES` and `AERO_CONFIG_PRE_PATCHED_FILENAME` (for a default override)

5. Add this `.gitignore` entry:

```gitignore
...
aeroConfigBuild/
```
