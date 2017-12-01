import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {asNumber} from 'react-jsonschema-form/lib/utils';

import validator from './../validator';
import Input from './../../../components/forms/Input';
import Error from './../../../components/forms/Error';

class BaseInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };
  }

  onInputChange = event => {
    const value = (event.target.value === '' && this.props.required) ? undefined : event.target.value;
    const errors = [];

    if (this.props.required && !value) {
      errors.push({
        message: 'required'
      });
    }

    if (this.props.schema.type === 'number' || this.props.schema.type === 'integer') {
      validator.validate(this.props.schema, asNumber(value));
    } else {
      validator.validate(this.props.schema, value);
    }

    if (validator.errors) {
      errors.push(...validator.errors);
    }

    this.setState({errors});
    this.props.onChange(value);
  };

  render() {
    const {
      id,
      value,
      placeholder,
      label,        // eslint-disable-line
      required,     // eslint-disable-line
      readonly,     // eslint-disable-line
      autofocus,    // eslint-disable-line
      options,      // eslint-disable-line
      schema,       // eslint-disable-line
      formContext,  // eslint-disable-line
      ...inputProps // eslint-disable-line
    } = this.props;
    let type = schema.type;

    if (type === 'integer') {
      type = 'number';
    }
    return (
      <div>
        <Input id={id}
          value={value}
          type={type}
          placeholder={placeholder}
          onChange={this.onInputChange}
          isInvalid={this.state.errors.length > 0}
        />
        <Error errors={this.state.errors}/>
      </div>
    );
  }
}

BaseInput.defaultProps = {
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false
};

if (process.env.NODE_ENV !== 'production') {
  BaseInput.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func
  };
}

export default BaseInput;
