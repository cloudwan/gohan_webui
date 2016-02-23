var Promise = require('promise');
var BootstrapDialog = require('bootstrap-dialog');
var ErrorView = require('./errorView');

require('../../bower_components/jsonform/lib/jsonform');

var DialogView = Backbone.View.extend({
  /**
   * Initialize of object properties.
   *
   * @class {DialogView}
   * @constructor
   * @param {string} options.action
   * @param {string} options.formTitle
   * @param {Object} options.data
   * @param {function} options.onsubmit
   * @param {Object} options.schema
   * @param {Object} options.parentProperty
   */
  initialize: function initialize(options) {
    this.errorView = new ErrorView();
    this.action = options.action;
    this.formTitle = options.formTitle;
    this.data = options.data;
    this.onsubmit = options.onsubmit;
    this.schema = options.schema;
    this.parentProperty = options.parentProperty;
    this.dialogSchema = {};
    this.additionalForm = this.schema.additionalForm[this.action] || ['*'];
    this.currentStep = 0;
    this.multiStep = _.isArray(this.additionalForm) && _.isArray(this.additionalForm[0]) ? true : false;
    this.dialog = new BootstrapDialog({
      size: BootstrapDialog.SIZE_WIDE,
      type: BootstrapDialog.TYPE_DEFAULT,
      title: this.formTitle,
      closeByKeyboard: false,
      spinicon: 'glyphicon glyphicon-refresh',
      onshown: function onshown() {
        $('.modal-body').css({
          'max-height': $(window).height() - 200 + 'px',
          'overflow-y': 'auto'
        });
      }
    });
    this.result = {};
    this.$form = $('<form></form>', this.$el);
  },

  /**
   * Adds new options if is required and updates content of dialog message.
   *
   * @param {object} [data]
   */
  updateDialogSchema: function updateDialogSchema(data) {
    var self = this;

    if (_.isUndefined(this.schema.filterByAction)) {
      this.dialogSchema = new Promise(function (resolve) {
        resolve(this.schema);
      }.bind(this));
    } else {
      this.dialogSchema = this.schema.filterByAction(this.action, this.parentProperty);
    }

    this.dialogSchema.then(function onFulfilled(schema) {
      _.each(schema, function iterator(value, key) {
        if (_.isObject(value) && key === 'properties') {
          _.each(value, function iterator(value) {
            _.each(value, function iterator(value, key, obj) {
              if (key === 'relation') {
                obj.enum.push('addNew' + value);
                obj.options['addNew' + value] = ' + New ' + value.charAt(0).toUpperCase() + value.slice(1);
              }
            });
          });
        }
      });

      this.$form.jsonForm({
        schema: schema,
        value: data || this.data,
        form: this.multiStep ? this.additionalForm[this.currentStep] : this.additionalForm,
        onSubmit: function onSubmit(errors) {
          if (errors) {
            return;
          }
          self.nextStep();
        }
      });
    }.bind(this));
  },

  /**
   * Renders new page in dialog message, if is needed,
   * if triggered callback onsubmit with data from dialog.
   */
  nextStep: function nextStep() {
    this.currentStep = this.currentStep + 1;
    this.data = _.extend(this.multiStep ? this.data : {}, this.$form.jsonFormValue());

    if (this.currentStep < this.additionalForm.length) {
      this.$form.html('');
      this.updateDialogSchema();
      this.stopSpin();

      if (this.currentStep === this.additionalForm.length - 1) {
        this.dialog.getButton('submit').text('Submit');
      }
    } else {
      this.onsubmit(this.data);
    }
  },

  /**
   * Stops spin in button and enables buttons.
   */
  stopSpin: function stopSpin() {
    this.dialog.enableButtons(true);
    this.dialog.setClosable(true);
    this.dialog.getButton('submit').stopSpin();
  },

  /**
   * Closes dialog.
   */
  close: function close() {
    this.dialog.close();
    this.remove();
    this.off();
  },

  /**
   * Renders dialog view.
   * @returns {DialogView}
   */
  render: function render() {
    var self = this;

    this.updateDialogSchema();

    this.$form.prepend('<div id="alerts_form"></div>');
    var $addNewOption = $('select', this.$form);

    if (!_.isUndefined($addNewOption)) {
      $(this.$form).on('change', 'select', function onClick(event) {
        if (event.target.tagName.toLowerCase() !== 'select') {
          return;
        }

        if (event.target.value.indexOf('addNew') !== -1) {
          var addSchema = self.schema.collection.get(event.target.value.slice(6));
          var formTitle = '<h4>Create ' + addSchema.get('title') + '</h4>';
          var subDialog = {};
          var onSubmit = function onSubmit(value) {
            var collection = addSchema.makeCollection();

            value.isNew = true;

            collection.create(value, {
              wait: true,
              success: function success() {
                collection.fetch({
                  success: function success() {
                    var data = self.$form.jsonFormValue();

                    _.each(data, function iterator(d, key) {
                      if (key.indexOf(addSchema.get('id')) !== -1) {
                        data[key] = value.id;
                      }
                    });
                    self.$form.html('');
                    self.updateDialogSchema(data);
                    subDialog.close();
                  },
                  error: function success() {
                    subDialog.stopSpin();
                  }
                });
              },
              error: function error(collection, response) {
                subDialog.errorView.render(collection, response);
                subDialog.stopSpin();
              }
            });
          };

          subDialog = new DialogView({
            action: 'create',
            formTitle: formTitle,
            data: {},
            onsubmit: onSubmit,
            schema: addSchema
          });
          subDialog.render();
        }
      });
    }
    this.dialog.setMessage(this.$form);
    this.dialog.addButton({
      id: 'submit',
      label: this.multiStep ? 'Next' : 'Submit',
      cssClass: 'btn-primary btn-raised btn-material-blue-600',
      action: function action() {
        self.dialog.enableButtons(false);
        self.dialog.setClosable(false);
        this.spin();
        self.$form.submit();
      }
    });
    this.dialog.open();
    return this;
  }
});

module.exports = DialogView;
