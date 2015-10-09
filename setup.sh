#!/bin/bash

set -e

# setup dev environment

sudo apt-get update
sudo apt-get -y install zip ruby-compass
npm install -g gulp
npm install gulp
npm install gulp-compass
npm install browser-sync
npm install gulp-jst
npm install gulp-concat
npm install gulp-template-compile
npm install gulp-minify-css
