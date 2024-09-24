# Setup the dev server
org="https://github.com/vortexdeveloperlabs/"

npm install

if [ ! -d dev-server ]; then
  git clone "${org}aero-dev-server.git" dev-server
fi

cd dev-server
  git pull
  bash deps.sh
cd ..

if [ ! -d extras ]; then
  mkdir extras
  curl https://raw.githubusercontent.com/vortexdeveloperlabs/sdk/refs/heads/main/aeroHandleSimple.js -o extras/handleWithExtras.js
fi