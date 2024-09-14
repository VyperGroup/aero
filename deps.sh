# Setup the dev server
org="https://github.com/VyperGroup/"

npm install > /dev/null

if [ ! -d dev-server ]
then
    git clone "${org}aero-dev-server.git" dev-server
fi

cd dev-server
    git pull > /dev/null
    bash deps.sh
cd ..