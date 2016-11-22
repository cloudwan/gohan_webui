import Backbone from 'backbone';
import _ from 'underscore';
import 'backbone-forms';

class SelectEditor extends Backbone.Form.editors.Select {
  setValue(value) {
    if (value) {
      super.setValue(value);
    }
  }

  _arrayToHtml(array) {
    return array.reduce((result, option) => {
      if (option instanceof Object && !Array.isArray(option)) {
        if (option.group) {
          result.push(`<optgroup label="${_.escape(option.group)}">`);
          result.push(this._getOptionsHtml(option.options));
          result.push('</optgroup>');
        } else {
          const val = (option.val || option.val === 0) ? option.val : '';
          result.push(`<option value="${val}">${_.escape(option.label)}</option>`);
        }
      } else {
        if (option === null) {
          result.push('<option value="">Not selected</option>');
          return result;
        }
        result.push(`<option>${_.escape(option)}</option>`);
      }
      return result;
    }, []).join('');
  }

  render() {
    const searchThreshold = 6;
    const options = {
      container: 'body',
      width: '100%'
    };

    const optionLength = Object.keys(this.schema.options).length;

    if ((this.schema.options instanceof Array)) {
      this.setOptions(this.schema.options);
    } else {
      const sortedOptions = Object.keys(this.schema.options)
        .sort((a, b) => this.schema.options[a].localeCompare(this.schema.options[b]))
        .reduce((acc, val) => {
          acc[val] = this.schema.options[val];
          return acc;
        }, (() => {
          if (this.schema.nullable && !this.schema.validators.includes('required')) {
            return {'': 'Not selected'};
          }
          return {};
        })());

      this.setOptions(sortedOptions);
    }

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
