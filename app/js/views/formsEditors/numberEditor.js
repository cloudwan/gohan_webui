import Backbone from 'backbone';
import 'backbone-forms';

class NumberEditor extends Backbone.Form.editors.Number {
  get defaultValue() {
    return '';
  }

  getValue() {
    const value = this.$el.val();

    return value === '' ? '' : parseFloat(value, 10);
  }
}

Backbone.Form.editors.Number = NumberEditor;
