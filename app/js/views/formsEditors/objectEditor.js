import Backbone from 'backbone';
import 'backbone-forms';

Backbone.Form.editors.Object = class ObjectEditor extends Backbone.Form.editors.Object {
  render() {
    const NestedForm = this.form.constructor;

    this.nestedForm = new NestedForm({
      schema: this.schema.subSchema,
      fields: this.schema.order || undefined,
      data: this.value,
      idPrefix: this.id + '_',
      Field: NestedForm.NestedField
    });

    this._observeFormEvents();

    this.$el.html(this.nestedForm.render().el);

    if (this.hasFocus) {
      this.trigger('blur', this);
    }

    return this;
  }
};
