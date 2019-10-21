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

