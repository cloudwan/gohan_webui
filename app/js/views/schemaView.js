/* global window, $ */
import BootstrapDialog from 'bootstrap-dialog';
import DialogView from './dialogView';
import _ from 'underscore';
import jsyaml from 'js-yaml';

import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/sortable';
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/theme-monokai';
import 'ace-builds/src-min-noconflict/mode-yaml';
import 'ace-builds/src-min-noconflict/mode-javascript';

import TableView from './tableView';

import schemaFormTemplate from './../../templates/schemaForm.html';
import propertyFormTemplate from './../../templates/propertyForm.html';

export default class SchemaView extends TableView {
  toLocal(data) {
    return data;
  }
  toServer(data) {
    return data;
  }
  dialogForm(action, formTitle, data, onsubmit) {
    this.schema.filterByAction(action, this.parentProperty).then(schema => {
      const onSubmit = values => {
        const propertiesOrder = [];
        const required = [];
        const properties = {};

        $('#properties_table tbody tr').each(function iterator() {
          const property = $(this).data('property');
          const id = property.id;

          if (id === undefined) {
            return;
          }

          if (properties[id]) {
            return;
          }

          propertiesOrder.push(property.id);

          if (property.required) {
            required.push(id);
          }

          delete property.id;
          delete property.required;
          properties[id] = property;
        });

        values.schema = {
          type: 'object',
          propertiesOrder,
          required,
          properties
        };

        onsubmit(values);
      };

      schema.additionalForm = ['*'];
      schema.propertiesOrder = [
        'id',
        'singular',
        'plural',
        'title',
        'description',
        'parent',
        'namespace',
        'prefix'
      ];
      schema.required = [];

      const propertyColumns = [
        {
          id: 'title',
          type: 'string'
        },
        {
          id: 'type',
          type: 'string',
          enum: [
            'string',
            'boolean',
            'integer',
            'number',
            'array',
            'object'
          ]
        },
        {
          id: 'description',
          type: 'string'
        },
        {
          id: 'required',
          type: 'checkbox'
        }
      ];
      const properties = [];

      if (data.schema === undefined) {
        data.schema = {
          properties: {
            id: {
              title: 'ID',
              type: 'string',
              description: 'ID',
              permission: ['create'],
              view: ['detail']
            },
            name: {
              title: 'Name',
              type: 'string',
              description: 'Name',
              permission: ['create', 'update']
            },
            description: {
              title: 'Description',
              type: 'string',
              description: 'Description',
              permission: ['create', 'update']
            },
            tenant_id: {  // eslint-disable-line camelcase
              title: 'Tenant ID',
              type: 'string',
              description: 'Tenant ID',
              permission: ['create'],
              view: ['detail']
            }
          },
          propertiesOrder: [
            'id',
            'name',
            'description',
            'tenant_id'
          ]
        };
      }

      this.dialog = new DialogView({
        action,
        formTitle,
        data,
        fields: schema.propertiesOrder,
        onsubmit: onSubmit,
        unformattedSchema: this.schema,
        schema: this.schema.toFormJSON(schema)
      });

      this.dialog.render();

      this.dialog.form.$el.append($(schemaFormTemplate({
        propertyColumns
      })));

      $('#properties_table tbody', this.dialog.form.$el).sortable();

      const dataSchema = data.schema || {};

      for (let id of dataSchema.propertiesOrder) {
        const property = _.extend({}, dataSchema.properties[id]);

        if (property === undefined) {
          return;
        }

        let required = false;

        if (dataSchema.required && dataSchema.required.indexOf(id) >= 0) {
          required = true;
        }

        property.id = id;
        property.required = required;
        properties.push(property);
      }

      const defaultProperty = {type: 'string'};

      properties.push(_.extend({}, defaultProperty));

      const addNewRow = property => {
        const $newRow = $(propertyFormTemplate({
          propertyColumns,
          property
        }));

        $('.delete', $newRow).on('click', function onClick() {
          if (!window.confirm('Are you sure to delete?')) { // eslint-disable-line no-alert
            return;
          }
          $(this).off('click');
          $(this).parent().parent().remove();
        });
        $('.id_form', $newRow).change(ensureNewRow);
        $('#properties_table tbody', this.dialog.form.$el).append($newRow);
        $('#id', $newRow).change(function onChange() {
          property.id = $(this).val();
        });
        $newRow.data('property', property);

        for (let column of propertyColumns) {
          $('#' + column.id, $newRow).change(function onChange() {
            if (column.type === 'checkbox') {
              property[column.id] = $(this).is(':checked');
            } else {
              property[column.id] = $(this).val();
            }
          });
        }
        $('button#detail', $newRow).click(() => {
          const $detailPane = $('<div style="width:500px;height:200px;"></div>');
          const ace = window.ace;
          const editor = ace.edit($detailPane.get(0));

          editor.getSession().setNewLineMode('unix');
          editor.setTheme('ace/theme/monokai');
          editor.getSession().setMode('ace/mode/yaml');
          editor.getSession().setTabSize(2);
          editor.$blockScrolling = 'Infinity';

          const yaml = jsyaml.safeDump(property);

          editor.getSession().setValue(yaml);
          BootstrapDialog.show({
            type: BootstrapDialog.TYPE_DEFAULT,
            title: 'Property Detail',
            closeByKeyboard: false,
            message: $detailPane,
            spinicon: 'glyphicon glyphicon-refresh',
            onshown: () => {
              $('.modal-body').css({
                'max-height': $(window).height() - 200 + 'px'
              });
            },
            buttons: [{
              id: 'submit',
              label: 'Submit',
              cssClass: 'btn-primary btn-raised btn-material-blue-600',
              action: function action(dialog) {
                const yaml = editor.getSession().getValue();
                const data = jsyaml.safeLoad(yaml);
                const $propertiesTable = $($('#properties_table tbody tr')
                  .get(properties.indexOf(property)));

                for (let key in property) {
                  delete property[key];
                }

                for (let key in data) {
                  property[key] = data[key];
                }

                for (let key in property) {
                  let value = property[key];

                  if (typeof value === 'boolean') {
                    $propertiesTable.find('#' + key).prop('checked', value);
                  } else {
                    $propertiesTable.find('#' + key).val(value);
                  }
                }
                dialog.close();
              }
            }]
          });
        });
      };
      const ensureNewRow = () => {
        let requireRow = true;

        $('.id_form', this.dialog.form.$el).each(function iterator() {
          if ($(this).val() === '\'\'') {
            requireRow = false;
          }
        });

        if (requireRow) {
          addNewRow(Object.assign({}, defaultProperty));
        }
      };

      for (let property of properties) {
        addNewRow(property);
      }
    });
  }
}
