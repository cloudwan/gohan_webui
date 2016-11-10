/* global $, window */
import Backbone, {View} from 'backbone';

import BootstrapDialog from 'bootstrap-dialog';

import ErrorView from './errorView';

import 'backbone-forms';
import 'backbone-forms/distribution/adapters/backbone.bootstrap-modal';
import './formsEditors/listEditor';
import './formsEditors/codeEditor';
import './formsEditors/template';
import './formsEditors/validators';
import './formsEditors/selectEditor';
import './formsEditors/numberEditor';

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
    this.formTitle = options.formTitle;
    this.template = options.template;
    this.data = options.data;
    this.onshow = options.onshow;
    this.onsubmit = options.onsubmit;
    this.onhide = options.onhide;
    this.unformattedSchema = options.unformattedSchema;
    this.schema = options.schema;
    this.fields = options.fields;
    this.events = options.events;
    this.addingRelationDialog = this.unformattedSchema.addingRelationDialog || [];
    this.dialog = new BootstrapDialog({
      size: BootstrapDialog.SIZE_WIDE,
      type: BootstrapDialog.TYPE_DEFAULT,
      title: this.formTitle,
      closeByKeyboard: false,
      spinicon: 'glyphicon glyphicon-refresh',
      onshown: () => {
        this.form.focus();
      },
      onhide: this.onhide,
      onshow: this.onshow
    });
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
   * Attaches event to form.
   *
   * @param {string} name
   * @param {function} callback
   */
  on(name, callback) {
    if (this.form) {
      this.form.on(name, callback);
    }
  }

  createRelationModel(passedSchema) {
    const data = passedSchema.toLocal({});
    const formTitle = '<h4>Create ' + passedSchema.get('title') + '</h4>';
    const action = 'create';
    const onsubmit = values => {
      values = passedSchema.toServer(values);
      values.isNew = true;
      const collection = passedSchema.makeCollection();

      collection.create(values).then(params => {
        this.updateSelectEditor(params[1]);
        this.updateDialogSchema();
        this.nestedDialog.close();
      }, error => {
        this.nestedDialog.errorView.render(...error);
        this.nestedDialog.stopSpin();
      });
    };
    const onhide = () => {
      const editor = this.form.fields[passedSchema.id + '_id'].editor;

      if (editor.getValue() === 'addNew' + passedSchema.id) {
        editor.setValue(undefined);
      }
    };

    passedSchema.filterByAction(action, this.parentProperty).then(schema => {
      this.nestedDialog = new DialogView({
        formTitle,
        data,
        onsubmit,
        onhide,
        schema: passedSchema.toFormJSON(schema),
        unformattedSchema: passedSchema,
        fields: schema.propertiesOrder
      });
      this.nestedDialog.render();
    }, error => {
      console.error(error);
    });
  }

  updateSelectEditor(params) {
    const schemaFieldName = Object.keys(params)[0];
    const feedback = params[schemaFieldName];
    const editor = this.form.fields[schemaFieldName + '_id'].editor;

    this.schema[schemaFieldName + '_id'].options[feedback.id] = feedback.name;

    editor.setOptions(this.schema[schemaFieldName + '_id'].options);
    editor.setValue(feedback.id);
  }

  updateDialogSchema() {
    for (let key in this.schema) {
      if (this.schema.hasOwnProperty(key)) {
        const field = this.schema[key];

        const nestedCreationAllowed = this.addingRelationDialog.includes(field.title);

        if (field.hasOwnProperty('relation') && field.type.toLowerCase() === 'select' && nestedCreationAllowed) {
          field.options['addNew' + field.relation] = ' + New ' + field.title;
        }
      }
    }
  }
  /**
   * Renders dialog view.
   * @returns {DialogView}
   */
  render() {
    this.updateDialogSchema();

    this.form = new Backbone.Form({
      schema: this.schema,
      data: this.data,
      fields: this.fields.filter(item => Object.keys(this.schema).includes(item)),
      template: this.template
    });

    for (let key in this.schema) {
      if (this.schema.hasOwnProperty(key)) {
        const field = this.schema[key];

        if (field.type.toLowerCase() === 'select') {
          this.on(key + ':change', (form, element) => {
            const elementKey = element.getValue();

            if (elementKey && elementKey.includes('addNew')) {
              const newSchema = this.unformattedSchema.collection.get(element.schema.relation);
              this.createRelationModel(newSchema);
            }
          });
        }
      }
    }

    if (this.events) {
      for (let key in this.events) {
        this.on(key, this.events[key]);
      }
    }
    this.form.render();
    this.form.$el.prepend('<div data-gohan="error"></div>');
    this.dialog.setMessage(this.form.el);
    this.dialog.addButton({
      id: 'submit',
      label: 'Submit',
      cssClass: 'btn-primary',
      action: () => {
        var error = this.form.validate();

        if (error) {
          console.error(error);
          return;
        }
        this.dialog.enableButtons(false);
        this.dialog.setClosable(false);
        this.onsubmit(this.form.getValue());
      }
    });
    $('[data-gohan="error"]', this.form.el).append(this.errorView.el);
    this.dialog.open();
    this.dialog.$modalBody.css({
      'max-height': $(window).height() - 200 + 'px',
      'overflow-y': 'auto'
    });
  }
}
