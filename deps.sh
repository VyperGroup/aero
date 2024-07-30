# Setup the dev server
org="https://github.com/VyperGroup/"

if [ ! -d aero ]
then
    git clone "${org}aero-dev-server.git" dev-server
fi

cd dev-server
    git pull > /dev/null
    bash deps.sh
cd ..