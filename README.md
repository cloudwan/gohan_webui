Chazuke
============

Web UI project for Gohan project
(https://github.com/cloudwan/gohan)

[![Join the chat at https://gitter.im/cloudwan/gohan](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/cloudwan/gohan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Getting started
------------------------------------

See getting started in Gohan

https://github.com/cloudwan/gohan

Setup development environment
------------------------------------

- Run gohan
- Install compass
```
    $ gem install compass
```
- Install gulp
```
    $ npm install gulp
```
- Install all npm dependencies
```
    $ npm install
``` 
- Copy configurations files
```
    $ cp config.json.sample config.json
    $ cp schema.json.sample schema.json
```
- Build application
```
    $ gulp
```
- Start dev server with auto refresh
```
    $ gulp dev-server
```
 Server starts on 
```
    http://localhost:8080/webpack-dev-server/app/index.html
```
- Build application for production
```
    $ gulp build-prod
```
