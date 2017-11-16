import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {asNumber} from 'react-jsonschema-form/lib/utils';

import Select from '../../../components/forms/Select/Select';
import Error from './../../../components/forms/Error';

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({type, items}, value) {
  if (type === 'array' && items && ['number', 'integer'].includes(items.type)) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }
  return value;
}

class SelectWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };
  }

  handleSelectChange = value => {
    const errors = [];

    if (this.props.required && !value) {
      errors.push({
        message: 'required'
      });
    }

    this.setState({errors});
    this.props.onChange(processValue(this.props.schema, value));
  };

  render() {
    const {
      id,
      value,
      options,
      disabled,
      readonly,
      label,      // eslint-disable-line
      required,   // eslint-disable-line
      multiple,   // eslint-disable-line
      autofocus  // eslint-disable-line
    } = this.props;

    return (
      <div>
        <Select id={id}
          haystack={options.enumOptions}
          value={Array.isArray(value) ? value.filter(item => Boolean(item)) : value}
          sort={true}
          readonly={readonly}
          disabled={disabled}
          onChange={this.handleSelectChange}
          isInvalid={this.state.errors.length > 0}
        />
        <Error errors={this.state.errors}/>
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func
  };
}

export default SelectWidget;
