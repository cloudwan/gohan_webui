UI Schema
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
