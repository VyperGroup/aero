# This file is an example of how you would get the latest build of aero and build your aero config

npm install > /dev/null

AERO_CONFIG_BUILD_PATH_ORIGINAL=./node_modules/aero-proxy/examples/aeroConfigBuild
if [ ! -z  ${AERO_CONFIG_BUILD_PATH+xxx} ]; then # If variable is undefined (for override), then set it to the default
  AERO_CONFIG_BUILD_PATH=./aeroConfigBuild
fi
AERO_BUILD_RSPACK_CONFIG="$AERO_CONFIG_BUILD_PATH/rspack.config.ts"
AERO_CONFIG_PATH_PRE="$AERO_CONFIG_BUILD_PATH/aeroDefaultConfig.ts"
if [ ! -z  ${AERO_CONFIG_PRE_PATCHED_FILENAME+xxx} ]; then
  AERO_CONFIG_PRE_PATCHED_FILENAME="aeroConfig"
fi
AERO_CONFIG_PATH_PRE_PATCHED_VER="$AERO_CONFIG_BUILD_PATH/$AERO_CONFIG_PRE_PATCHED_FILENAME.ts"
AERO_CONFIG_PATH_FINAL="$AERO_CONFIG_BUILD_PATH/dist/config.aero.js"
if [ ! -z  ${AERO_PATH+xxx} ]; then
  >&2 echo "Fatal error: you forgot to define the bash variable \$AERO_PATH before running this script"
else
  if [ ! -z  ${YOUR_CONFIG_PATCHES+xxx} ]; then # If variable is not defined...
    # I recommend adding patch files in the aero config build path to apply to the default config instead of writing to the file itself if you want to modify the config because new config entries might come in later releases of aero and break whatever you have until you update the modified default config
    # E.g.: $AERO_CONFIG_BUILD_PATH/<YOUR PATCH FILES HERE>.patch ...
    YOUR_CONFIG_PATCHES=""
  fi

  if [ -d ./node_modules/aero-proxy/dist ]; then
    if [ -d $AERO_PATH ]; then
      rm -r $AERO_PATH
    fi
    cp -r ./node_modules/aero-proxy/dist $AERO_PATH
    cp -r $AERO_CONFIG_BUILD_PATH_ORIGINAL $AERO_CONFIG_BUILD_PATH
    rspack build -c $AERO_BUILD_RSPACK_CONFIG > /dev/null
    cp $AERO_CONFIG_PATH_FINAL $AERO_PATH
    if [ "$YOUR_CONFIG_PATCHES" == ""]; then
      cp $AERO_CONFIG_PATH_PRE $AERO_CONFIG_PATH_PRE_PATCHED_VER
    else
      patch -u $AERO_CONFIG_PATH_PRE -i -N $AERO_CONFIG_PATH_PRE_PATCHED_VER > /dev/null
    fi
  fi
fi