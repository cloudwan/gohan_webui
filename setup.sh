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
    cp src/config.json.sample src/config.json
fi

npm install
