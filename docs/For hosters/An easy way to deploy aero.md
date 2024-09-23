# An easy way to deploy aero

1. Use the [proxy SDK](https://github.com/vortexdeveloperlabs/sdk) for aero's handler and registering the SW [*example*](https://github.com/vortexdeveloperlabs/aero-demo-site/blob/main/sw.js#L4-L6)
2. Roll out your own config on-demand with a structure such as what is in `examples/aeroConfigBuild`
3. Create a deps.sh for getting the latest stable aero release like this:

```sh
npm install > /dev/null

AERO_CONFIG_BUILD=...
AERO_CONFIG_PATH="$AERO_CONFIG_BUILD/..." # Path to the built aero config (should be `aeroConfigBuild/dist/config.aero.js`)
AERO_PATH=... # Path to the directory where aero's files should be (this will clean out the entire folder so don't put anything else in it)

AERO_BUILD_RSPACK_CONFIG="$AERO_CONFIG_BUILD/rspack.config.ts"

if [ -d ./node_modules/aero-proxy/dist ]; then
  if [ -d $AERO_PATH ]; then
    rm -r $AERO_PATH
  fi
  cp -r ./node_modules/aero-proxy/dist $AERO_PATH
  rspack build -c $AERO_CONFIG_BUILD/rspack.config.ts > /dev/null
  cp $AERO_BUILD_RSPACK_CONFIG $AERO_CONFIG_PATH
fi
```
