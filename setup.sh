#!/bin/bash

# Install hooks.
./installHooks.sh

set -xe

# setup dev environment

if [ "$(uname)" == "Darwin" ]; then
    brew install npm
else
    apt-get update
fi

if ! [ -e app/config.json ]; then
    cp app/config.json.sample app/config.json
fi

npm install
