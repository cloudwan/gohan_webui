UI SCHEMA - how to
=============================================================================
To use uiSchema please add ui schema item to specified lang json. Schema should
look like:
```
[
  {
    "id": "<ID of json schema>",
    "properties": {
      "<property name>" : {
        "ui:widget": "<registered widget name>",
      }
    }
  }
]

```
UI schema options can be found on:
https://github.com/mozilla-services/react-jsonschema-form#the-uischema-object
