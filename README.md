Gohan Web UI
======================================================================================================================

Web UI project for Gohan project
(https://github.com/cloudwan/gohan)

[![Join the chat at https://gitter.im/cloudwan/gohan](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/cloudwan/gohan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Getting started
----------------------------------------------------------------------------------------------------------------------

See getting started in Gohan

https://github.com/cloudwan/gohan

Setup development environment
----------------------------------------------------------------------------------------------------------------------

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

Config file
----------------------------------------------------------------------------------------------------------------------
`config.json` file should be located in the same directory as all source files. Sample configuration is included in `config.json.sample` file.

Possible fields in config file:
- `authUrl` - URL to Keystone
- `gohan` - Gohan connection config, must be an object with following fields:
  - `schema` - path to JSON Schema
  - `url` - URL to Gohan server
- `sidebar` - array of custom sidebar buttons, must contain objects with following fields:
  - `path`
  - `title` 
  - `id`
- `sidebarFavorites` - array of links to views, must contain resources' IDs
- `sidebarCategories` - array of objects including information about views' categories, must contain objects with following fields:
  - `name` - display name of category
  - `id` - ID of category
  - `items` - array of links to views in the category
- `sidebarChildResources` - array of schema IDs of child resources which should be visible in sidebar menu
- `routes` - config array for routing, must contain objects with following fields:
  - `path` - URL path to view
  - `viewClass` - name of React component related to the view (in `src/routes/componentList.js`)
  - `name` - name of route
  - `exact` - match path exactly, default `true`
- `errorMessages` - map of error messages
  - `tokenExpire` - token expired message
- `pageLimit` - limit of displayed items in page
- `loginRequestTimeout` - time left (in ms) to token expiration (when token renew dialog should be shown)
- `polling` - flag to enable polling (must be true or false)
- `pollingInterval` - interval (in ms) of polling
- `storagePrefix` - prefix to store token information (local- and sessionStorage)
- `tableDefaultSortKey` - default sort key
- `tableDefaultSortOrder` - default sort order (asc or desc)
- `title`- title of web page
- `followableRelations` - flag to enable following resource by reference
- `useKeystoneDomain` - flag to enable use domain feature in keystone v3
- `selectDomainFromHost` - regex to select domain from host (keystone v3)
- `domainName` - default domain name


UI schema
----------------------------------------------------------------------------------------------------------------------
`locales/en-us/uiSchema.json` file containg the definition of specific UI behaviors in dialogs like hiding and showing fields

The JSON file should contain an array of objects with following fields:
 - `id` - ID of JSON Schema resource
 - `title` - (optional) - title of resource
 - `properties` - (optional) - properties customization, objects with following fields:
    - `[fieldName]` - (optional) - customization of single field, objects with following fields:
       - `ui:widget` - (optional) -  alternative widget
       - `ui:field` - (optional) - alternative field
       - `ui:step` - (optional) - specified step in number input field
       - `ui:labelTemplate` - (optional) - label custom template for select field
       - `ui:requiredResource` - (optional) - custom require collection for select field
       - `ui:query` - (optional) - query to fetch additional data for select field
 - `logic` - (optional) - custom dialog logic
    - `[fieldName]` - (optional) - field name
       - `[fieldName]` - (field name (if parent is Object), when array, `[fieldName]` should be `items`
          - `[value]` - (optional) - specified value of field
             - `hide` - array of fields to hide

Other methods of customization using UI schema can be find [react-jsonschema-form documentation](https://github.com/rjsf-team/react-jsonschema-form/tree/v0.51.0#form-customization)
