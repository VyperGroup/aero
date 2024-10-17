# Setup the dev server
org="https://github.com/vortexdeveloperlabs/"

npm i

if [ ! -d dev-server ]; then
  git clone "${org}aero-dev-server.git" dev-server
fi

cd dev-server
  npm i
  bash deps.sh
cd ..
