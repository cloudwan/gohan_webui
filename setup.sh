#!/bin/bash

set -e

# setup dev environment

sudo apt-get update
sudo apt-get install ruby-compass
npm install -g webpack
npm install -g webpack-dev-server
