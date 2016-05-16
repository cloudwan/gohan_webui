/* global $, window */
import Backbone, {View} from 'backbone';

import BootstrapDialog from 'bootstrap-dialog';

import ErrorView from './errorView';

import 'backbone-forms';
import 'backbone-forms/distribution/adapters/backbone.bootstrap-modal';
import 'backbone-forms/distribution/editors/list';
import ObjectListEditor from './formsEditors/objectListEditor';
import './formsEditors/codeEditor';
import './formsEditors/template';

import 'jquery-ui/core';
import 'jquery-ui/widget';
import 'jquery-ui/mouse';
import 'jquery-ui/sortable';

Backbone.Form.editors.List.Object = ObjectListEditor;

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
    this.data = options.data;
    this.onsubmit = options.onsubmit;
    this.schema = options.schema;
    this.fields = options.fields;
    this.events = options.events;
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

  /**
   * Renders dialog view.
   * @returns {DialogView}
   */
  render() {
    this.form = new Backbone.Form({
      schema: this.schema,
      data: this.data,
      fields: this.fields.filter(item => Object.keys(this.schema).includes(item)),
      template: this.template
    });
    if (this.events) {
      for (let key in this.events) {
        this.on(key, this.events[key]);
      }
    }
    this.form.render();
    this.dialog.setMessage(this.form.el);
    this.dialog.addButton({
      id: 'submit',
      label: 'Submit',
      cssClass: 'btn-primary btn-lg',
      action: function action() {
        var error = this.form.validate();

        if (error) {
          console.error(error);
          return;
        }
        this.dialog.enableButtons(false);
        this.dialog.setClosable(false);
        this.onsubmit(this.form.getValue());
      }.bind(this)
    });
    $('.ui-sortable', this.form.$el).sortable();
    this.dialog.open();
  }
}
