import Backbone from 'backbone';
import 'backbone-forms';

export default class ObjectListEditor extends Backbone.Form.editors.Base {
  get hasNestedForm() {
    return true;
  }

  constructor(options, ...params) {
    super(options, ...params);

    if (!this.form) throw new Error('Missing required option \'form"\'');
    if (!this.schema.subSchema) throw new Error('Missing required \'schema.subSchema\' option for Object editor');
  }

  render() {
    const NestedForm = this.form.constructor;
    this.nestedForm = new NestedForm({
      schema: this.schema.subSchema,
      fields: this.schema.order || undefined,
      data: this.value,
      Field: NestedForm.NestedField
    });

    this.$el.html(this.nestedForm.render().el);

    if (this.hasFocus) {
      this.trigger('blur', this);
    }

    return this;
  }

  getValue() {
    if (this.nestedForm) {
      return this.nestedForm.getValue();
    }

    return this.value;
  }

  setValue(value) {
    this.value = value;

    this.render();
  }

  focus() {
    if (this.hasFocus) {
      return;
    }

    this.nestedForm.focus();
  }

  blur() {
    if (!this.hasFocus) {
      return;
    }

    this.nestedForm.blur();
  }

  remove() {
    this.nestedForm.remove();

    Backbone.View.prototype.remove.call(this);
  }

  validate() {
    return this.nestedForm.validate();
  }
}
