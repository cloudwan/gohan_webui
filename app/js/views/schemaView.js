var Backbone = require('backbone');
var BootstrapDialog = require('bootstrap-dialog');
var DialogView = require('./dialogView');
var jsyaml = require('js-yaml');

require('./../../bower_components/jquery-ui/ui/core');
require('./../../bower_components/jquery-ui/ui/widget');
require('./../../bower_components/jquery-ui/ui/mouse');
require('./../../bower_components/jquery-ui/ui/sortable');
require('./../../bower_components/jsonform/lib/jsonform');
require('./../../bower_components/ace-builds/src-min-noconflict/ace');
require('./../../bower_components/ace-builds/src-min-noconflict/theme-monokai');
require('./../../bower_components/ace-builds/src-min-noconflict/mode-yaml');
require('./../../bower_components/ace-builds/src-min-noconflict/mode-javascript');

var schemaFormTemplate = require('./../../templates/schemaForm.html');
var propertyFormTemplate = require('./../../templates/propertyForm.html');
var TableView = require('./tableView');

var SchemaView = TableView.extend({
  toLocal: function toLocal(data) {
    return data;
  },
  toServer: function toServer(data) {
    return data;
  },
  dialogForm: function dialogForm(action, formTitle, data, onsubmit) {
    var self = this;
    var schema = self.schema.filterByAction(action, self.parentProperty);
    var onSubmit = function onSubmit(values) {
      var propertiesOrder = [];
      var required = [];
      var properties = {};

      $('#properties_table tbody tr').each(function iterator() {
        var property = $(this).data('property');
        var id = property.id;

        if (_.isUndefined(id)) {
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

      var schema = {
        type: 'object',
        propertiesOrder: propertiesOrder,
        required: required,
        properties: properties
      };

      values.schema = schema;

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

    var propertyColumns = [
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
    var properties = [];

    if (_.isUndefined(data.schema)) {
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
          tenant_id: {// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
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
      action: action,
      formTitle: formTitle,
      data: data,
      onsubmit: onSubmit,
      schema: schema
  });

    this.dialog.render();

    this.dialog.$form.append($(schemaFormTemplate({
      propertyColumns: propertyColumns
    })));
    $('#properties_table tbody', this.dialog.$form).sortable();

    var dataSchema = data.schema || {};

    _.each(dataSchema.propertiesOrder, function iterator(id) {
      var property = _.extend({}, dataSchema.properties[id]);

      if (_.isUndefined(property)) {
        return;
      }

      var required = false;

      if (dataSchema.required && dataSchema.required.indexOf(id) >= 0) {
        required = true;
      }

      property.id = id;
      property.required = required;
      properties.push(property);
    });

    var defaultProperty = {type: 'string'};

    properties.push(_.extend({}, defaultProperty));

    var addNewRow = function addNewRow(property) {
      var $newRow = $(propertyFormTemplate({
        propertyColumns: propertyColumns,
        property: property
      }));

      $('.id_form', $newRow).change(ensureNewRow);
      $('#properties_table tbody', self.dialog.$form).append($newRow);
      $('#id', $newRow).change(function onChange() {
        property.id = $(this).val();
      });
      $newRow.data('property', property);
      _.each(propertyColumns, function iterator(column) {
        $('#' + column.id, $newRow).change(function onChange() {
          if (column.type == 'checkbox') {
            property[column.id] = $(this).is(':checked');
          } else {
            property[column.id] = $(this).val();
          }
        });
      });
      $('button#detail', $newRow).click(function onClick() {
        var $detailPane = $('<div style="width:500px;height:200px;"></div>');
        var ace = window.ace;
        var editor = ace.edit($detailPane.get(0));

        editor.getSession().setNewLineMode('unix');
        editor.setTheme('ace/theme/monokai');
        editor.getSession().setMode('ace/mode/yaml');
        editor.getSession().setTabSize(2);
        editor.$blockScrolling = 'Infinity';

        var yaml = jsyaml.safeDump(property);

        editor.getSession().setValue(yaml);
        BootstrapDialog.show({
          type: BootstrapDialog.TYPE_DEFAULT,
          title: 'Property Detail',
          closeByKeyboard: false,
          message: $detailPane,
          spinicon: 'glyphicon glyphicon-refresh',
          onshown: function onshown() {
            $('.modal-body').css({
              'max-height': $(window).height() - 200 + 'px'
            });
          },
          buttons: [{
            id: 'submit',
            label: 'Submit',
            cssClass: 'btn-primary btn-raised btn-material-blue-600',
            action: function action(dialog) {
              var yaml = editor.getSession().getValue();
              var data = jsyaml.safeLoad(yaml);
              var $propertiesTable = $($('#properties_table tbody tr').get(properties.indexOf(property)));

              _.each(property, function iterator(value, key) {
                delete property[key];
              });

              _.each(data, function iterator(value, key) {
                property[key] = value;
              });

              _.each(property, function iterator(value, key) {
                if (_.isBoolean(value)) {
                  $propertiesTable.find('#' + key).prop('checked', value);
                } else {
                  $propertiesTable.find('#' + key).val(value);
                }
              });
              dialog.close();
            }
          }]
        });
      });
    };
    var ensureNewRow = function ensureNewRow() {
      var requireRow = true;

      $('.id_form', self.dialog.$form).each(function iterator() {
        if ($(this).val() == '\'\'') {
          requireRow = false;
        }
      });

      if (requireRow) {
        addNewRow(_.extend({}, defaultProperty));
      }
    };

    _.each(properties, function iterator(property) {
      addNewRow(property);
    });
  }
});

module.exports = SchemaView;
