import Backbone from 'backbone';
import 'backbone-forms';

class SelectEditor extends Backbone.Form.editors.Select {
  setValue(value) {
    if (value) {
      super.setValue(value);
    }
  }
}

Backbone.Form.editors.Select = SelectEditor;
