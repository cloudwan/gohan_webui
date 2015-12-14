var Backbone = require('backbone');
var $ = require('jquery');
var jsyaml = require('js-yaml');

require('./../../bower_components/jsonform/lib/jsonform');
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
    var $form = $('<form></form>', self.$el);
    var schema = self.schema.filterByAction(action, self.parentProperty);

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

    $form.jsonForm({
      schema: schema,
      value: data,
      form: ['*'],
      onSubmit: function onSubmit(errors, values) {
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

        if (errors) {
          self.dialog.getButton('submit').stopSpin();
          self.dialog.enableButtons(true);
          self.dialog.setClosable(true);
          return;
        }

        onsubmit(values);
      }
    });
    $form.append($(schemaFormTemplate({
      propertyColumns: propertyColumns
    })));
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
      $('#properties_table tbody', $form).append($newRow);
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
        var dialog = BootstrapDialog.show({
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

              _.each(property, function iterator(value, key) {
                delete property[key];
              });

              _.each(data, function iterator(value, key) {
                property[key] = value;
              });

              dialog.close();
            }
          }]
        });
      });
    };
    var ensureNewRow = function ensureNewRow() {
      var requireRow = true;

      $('.id_form', $form).each(function iterator() {
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

    $('#properties_table tbody', $form).sortable();
    $form.prepend('<div id="alerts_form"></div>');
    self.dialog = BootstrapDialog.show({
      size: BootstrapDialog.SIZE_WIDE,
      type: BootstrapDialog.TYPE_DEFAULT,
      title: formTitle,
      closeByKeyboard: false,
      message: $form,
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
        action: function action() {
          self.dialog.enableButtons(false);
          self.dialog.setClosable(false);
          this.spin();
          $form.submit();
        }
      }]
    });
  }
});

module.exports = SchemaView;
