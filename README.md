Gohan Web UI
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

- Run gohan server
- Install npm dependencies
```
    $ npm install
```
- Copy configurations files
```
    $ cp app/config.json.sample app/config.json
```
- Build application for development
```
    $ npm run build-dev
```
- Start dev server with auto refresh and options. Learn more about options, read the [official document](https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli).
```
    $ npm run dev-server
    $ npm run dev-server -- --host 0.0.0.0 --https
```
- Server starts on
```
    http://localhost:8080/
```
- Start tests
```
    $ npm run test
```
- Build application for production
```
    $ npm run build
```
