#!/bin/bash

# Install hooks.
./installHooks.sh

set -xe

# setup dev environment

if [ "$(uname)" == "Darwin" ]; then
    brew install npm
    sudo gem install compass
else
    apt-get update
    apt-get -y install ruby-compass
fi

if ! [ -e app/config.json ]; then
    cp app/config.json.sample app/config.json
fi

npm install -g karma

npm install webpack webpack-dev-server

npm install
