/* global $ _ confirm*/
import Backbone from 'backbone';
import 'backbone-forms';
import ObjectListEditor from './objectListEditor';

Backbone.Form.editors.List = class List extends Backbone.Form.editors.Base {

  get events() {
    return {
      'click [data-action="add"]': event => {
        event.stopPropagation();
        event.preventDefault();
        const defaultValue = Array.isArray(this.value) ? this.value[0] : this.value;

        this.addItem(defaultValue, true);
      }
    };
  }

  static template() {
    return _.template(
      '<div>' +
      '  <div data-items></div>' +
      '  <button type="button" data-action="add">Add</button>' +
      '</div>', Backbone.Form.templateSettings);
  }

  constructor(options) {
    super(options);

    const editors = Backbone.Form.editors;
    const type = this.schema.itemType;

    if (!this.schema) {
      throw new Error('Missing required option \'schema\'');
    }

    // Default to Text
    if (!type) {
      this.Editor = editors.Text;
    } else if (editors.List[type]) {
      this.Editor = editors.List[type];
    } else {
      this.Editor = editors[type];
    }

    this.items = [];
  }

  render() {
    const value = this.value || [];
    const $el = $($.trim(List.template()));

    this.$list = $el.is('[data-items]') ? $el : $el.find('[data-items]');

    if (value.length) {
      value.forEach(itemValue => {
        this.addItem(itemValue);
      });
    } else if (!this.Editor.isAsync) {
      this.addItem();
    }

    this.setElement($el);
    this.$el.attr('id', this.id);
    this.$el.attr('name', this.key);

    if (this.hasFocus) this.trigger('blur', this);

    return this;
  }

  /**
   * Add a new item to the list
   * @param {Mixed} [value]           Value for the new item editor
   * @param {Boolean} [userInitiated] If the item was added by the user clicking 'add'
   */
  addItem(value, userInitiated) {

    const editors = Backbone.Form.editors;

    // Create the item
    const item = new editors.List.Item({
      list: this,
      form: this.form,
      schema: this.schema,
      value,
      Editor: this.Editor,
      key: this.key
    }).render();

    const _addItem = () => {
      this.items.push(item);
      this.$list.append(item.el);

      item.editor.on('all', event => {
        if (event === 'change') return;

        // args = ["key:change", itemEditor, fieldEditor]
        var args = _.toArray(arguments);
        args[0] = 'item:' + event;
        args.splice(1, 0, this);
        // args = ["item:key:change", this=listEditor, itemEditor, fieldEditor]

        editors.List.prototype.trigger.apply(this, args);
      }, this);

      item.editor.on('change', function () {
        if (!item.addEventTriggered) {
          item.addEventTriggered = true;
          this.trigger('add', this, item.editor);
        }
        this.trigger('item:change', this, item.editor);
        this.trigger('change', this);
      }, this);

      item.editor.on('focus', function () {
        if (this.hasFocus) return;
        this.trigger('focus', this);
      }, this);
      item.editor.on('blur', () => {
        if (!this.hasFocus) return;
        setTimeout(() => {
          if (_.find(this.items, item => {
            return item.editor.hasFocus;
          })) return;
          this.trigger('blur', this);
        }, 0);
      }, this);

      if (userInitiated || value) {
        item.addEventTriggered = true;
      }

      if (userInitiated) {
        this.trigger('add', this, item.editor);
        this.trigger('change', this);
      }
    };

    // Check if we need to wait for the item to complete before adding to the list
    if (this.Editor.isAsync) {
      item.editor.on('readyToAdd', _addItem, this);
    } else {
      // Most editors can be added automatically
      _addItem();
      item.editor.focus();
    }

    return item;
  }

  /**
   * Remove an item from the list
   * @param {List.Item} item
   */
  removeItem(item) {
    // Confirm delete
    const confirmMsg = this.schema.confirmDelete;
    if (confirmMsg && !confirm(confirmMsg)) { // eslint-disable-line no-alert
      return;
    }

    const index = _.indexOf(this.items, item);

    this.items[index].remove();
    this.items.splice(index, 1);

    if (item.addEventTriggered) {
      this.trigger('remove', this, item.editor);
      this.trigger('change', this);
    }

    if (!this.items.length && !this.Editor.isAsync) this.addItem();
  }

  getValue() {
    const values = _.map(this.items, function (item) {
      return item.getValue();
    });

    // Filter empty items
    return _.without(values, undefined, '');
  }

  setValue(value) {
    this.value = value;
    this.render();
  }

  focus() {
    if (this.hasFocus) return;

    if (this.items[0]) this.items[0].editor.focus();
  }

  blur() {
    if (!this.hasFocus) return;

    var focusedItem = _.find(this.items, function (item) {
      return item.editor.hasFocus;
    });

    if (focusedItem) focusedItem.editor.blur();
  }

  /**
   * Override default remove function in order to remove item views
   */
  remove() {
    _.invoke(this.items, 'remove');

    Backbone.Form.editors.Base.prototype.remove.call(this);
  }

  /**
   * Run validation
   *
   * @return {Object|Null}
   */
  validate() {
    if (!this.validators) return null;

    // Collect errors
    const errors = _.map(this.items, function (item) {
      return item.validate();
    });

    // Check if any item has errors
    const hasErrors = Boolean(_.compact(errors).length);
    if (!hasErrors) return null;

    // If so create a shared error
    var fieldError = {
      type: 'list',
      message: 'Some of the items in the list failed validation',
      errors
    };

    return fieldError;
  }
};


/**
 * A single item in the list
 *
 * @param {editors.List} options.list The List editor instance this item belongs to
 * @param {Function} options.Editor   Editor constructor function
 * @param {String} options.key        Model key
 * @param {Mixed} options.value       Value
 * @param {Object} options.schema     Field schema
 */
Backbone.Form.editors.List.Item = class ListItem extends Backbone.Form.editors.Base {

  get events() {
    return {
      'click [data-action="remove"]': event => {
        event.stopPropagation();
        event.preventDefault();
        this.list.removeItem(this);
      },
      'keydown input[type=text]': event => {
        if (event.keyCode !== 13) return;
        event.stopPropagation();
        event.preventDefault();
        this.list.addItem();
        this.list.$list.find('> li:last input').focus();
      }
    };
  }

  static template() {
    return _.template(
      '<div>' +
      '  <span data-editor></span>' +
      '  <button type="button" data-action="remove">&times;</button>' +
      '</div>'
      , null, Backbone.Form.templateSettings);
  }

  static errorClassName() {
    return 'error';
  }

  constructor(options) {
    super(options);

    this.list = options.list;
    this.schema = options.schema || this.list.schema;
    this.value = options.value;
    this.Editor = options.Editor || Backbone.Form.editors.Text;
    this.key = options.key;
    this.template = options.template || this.schema.itemTemplate || this.constructor.template;
    this.errorClassName = options.errorClassName || this.constructor.errorClassName;
    this.form = options.form;
  }

  render() {
    // Create editor
    this.editor = new this.Editor({
      key: this.key,
      schema: this.schema,
      value: this.value,
      list: this.list,
      item: this,
      form: this.form
    }).render();

    // Create main element
    const $el = $($.trim(this.template()));

    $el.find('[data-editor]').append(this.editor.el);

    // Replace the entire element so there isn't a wrapper tag
    this.setElement($el);

    return this;
  }

  getValue() {
    return this.editor.getValue();
  }

  setValue(value) {
    this.editor.setValue(value);
  }

  focus() {
    this.editor.focus();
  }

  blur() {
    this.editor.blur();
  }

  remove() {
    this.editor.remove();

    Backbone.View.prototype.remove.call(this);
  }

  validate() {
    const value = this.getValue();
    const formValues = this.list.form ? this.list.form.getValue() : {};
    const validators = this.schema.validators;
    const getValidator = this.getValidator;

    if (!validators) return null;

    // Run through validators until an error is found
    let error = null;
    _.every(validators, function (validator) {
      error = getValidator(validator)(value, formValues);

      return !error;
    });

    // Show/hide error
    if (error) {
      this.setError(error);
    } else {
      this.clearError();
    }

    // Return error to be aggregated by list
    return error ? error : null;
  }

  /**
   * Show a validation error
   */
  setError(err) {
    this.$el.addClass(this.errorClassName);
    this.$el.attr('title', err.message);
  }

  /**
   * Hide validation errors
   */
  clearError() {
    this.$el.removeClass(this.errorClassName);
    this.$el.attr('title', null);
  }
};

Backbone.Form.editors.List.Object = ObjectListEditor;
