import Backbone from 'backbone';
import 'backbone-forms';

class SelectEditor extends Backbone.Form.editors.Select {
  setValue(value) {
    if (value) {
      super.setValue(value);
    }
  }

  render() {
    super.render();

    const searchThreshold = 6;
    const options = {
      container: 'body',
      width: '100%'
    };
    const optionLength = Object.keys(this.schema.options).length;

    if (optionLength >= searchThreshold) {
      options.liveSearch = true;
    }
    this.$el.addClass('selectpicker');
    setTimeout(() => {
      this.$el.selectpicker(options);
    }, 0);
    return this;
  }
}

Backbone.Form.editors.Select = SelectEditor;
