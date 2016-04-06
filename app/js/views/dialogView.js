/* global $, window */
import {View} from 'backbone';

import './../../../node_modules/json-form/lib/jsonform';
import BootstrapDialog from 'bootstrap-dialog';

import ErrorView from './errorView';

export default class DialogView extends View {
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
  constructor(options) {
    super(options);

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
    this.multiStep = Array.isArray(this.additionalForm) &&
      Array.isArray(this.additionalForm[0]);
    this.dialog = new BootstrapDialog({
      size: BootstrapDialog.SIZE_WIDE,
      type: BootstrapDialog.TYPE_DEFAULT,
      title: this.formTitle,
      closeByKeyboard: false,
      spinicon: 'glyphicon glyphicon-refresh',
      onshown: () => {
        $('.modal-body').css({
          'max-height': $(window).height() - 200 + 'px',
          'overflow-y': 'auto'
        });
      }
    });
    this.result = {};
    this.$form = $('<form></form>', this.$el);
  }

  /**
   * Adds new options if is required and updates content of dialog message.
   *
   * @param {object} [data]
   */
  updateDialogSchema(data) {
    if (this.schema.filterByAction === undefined) {
      this.dialogSchema = new Promise(resolve => {
        resolve(this.schema);
      });
    } else {
      this.dialogSchema = this.schema.filterByAction(this.action, this.parentProperty);
    }

    this.dialogSchema.then(schema => {
      for (let key in schema) {
        if (!schema.hasOwnProperty(key)) {
          continue;
        }

        const value = schema[key];

        if (Boolean(value) && value.constructor === Object && key === 'properties') {
          for (let key1 in value) {
            if (!value.hasOwnProperty(key1)) {
              continue;
            }

            const val = value[key1];

            for (let key2 in val) {
              if (!val.hasOwnProperty(key2)) {
                continue;
              }

              if (key2 === 'relation') {
                val.enum.push('addNew' + val[key2]);
                val.options['addNew' + val[key2]] = ' + New ' + val.title;
              }
            }
          }
        }
      }

      this.$form.jsonForm({
        schema,
        value: data || this.data,
        form: this.multiStep ? this.additionalForm[this.currentStep] : this.additionalForm,
        onSubmit: errors => {
          if (errors) {
            return;
          }
          this.nextStep();
        }
      });
    });
  }

  /**
   * Renders new page in dialog message, if is needed,
   * if triggered callback onsubmit with data from dialog.
   */
  nextStep() {
    this.currentStep = this.currentStep + 1;
    this.data = Object.assign(this.multiStep ? this.data : {}, this.$form.jsonFormValue());

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
  }

  /**
   * Stops spin in button and enables buttons.
   */
  stopSpin() {
    this.dialog.enableButtons(true);
    this.dialog.setClosable(true);
    this.dialog.getButton('submit').stopSpin();
  }

  /**
   * Closes dialog.
   */
  close() {
    this.dialog.close();
    this.remove();
    this.off();
  }

  /**
   * Renders dialog view.
   * @returns {DialogView}
   */
  render() {
    this.updateDialogSchema();
    this.$form.prepend('<div id="alerts_form"></div>');
    const $addNewOption = $('select', this.$form);

    if ($addNewOption !== undefined) {
      $(this.$form).on('change', 'select', event => {
        if (event.target.tagName.toLowerCase() !== 'select') {
          return;
        }

        if (event.target.value.indexOf('addNew') !== -1) {
          const addSchema = this.schema.collection.get(event.target.value.slice(6));
          const formTitle = '<h4>Create ' + addSchema.get('title') + '</h4>';
          let subDialog = {};
          const onSubmit = value => {
            const collection = addSchema.makeCollection();

            value.isNew = true;

            collection.create(value).then(() => {
              const data = this.$form.jsonFormValue();

              for (let key in data) {
                if (key.indexOf(addSchema.get('id')) !== -1) {
                  data[key] = value.id;
                }
              }
              this.$form.html('');
              this.updateDialogSchema(data);
              subDialog.close();
            }, (coll, response) => {
              subDialog.errorView.render(coll, response);
              subDialog.stopSpin();
            });
          };

          subDialog = new DialogView({
            action: 'create',
            formTitle,
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
      action: () => {
        this.dialog.enableButtons(false);
        this.dialog.setClosable(false);
        this.dialog.getButton('submit').spin();
        this.$form.submit();
      }
    });

    this.dialog.open();
    return this;
  }
}
