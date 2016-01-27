#!/bin/bash

# Install hooks.
./installHooks.sh

set -e

# setup dev environment

sudo apt-get update
sudo apt-get install ruby-compass
npm install -g webpack
npm install -g webpack-dev-server
npm install -g jscs
npm install
bower install
