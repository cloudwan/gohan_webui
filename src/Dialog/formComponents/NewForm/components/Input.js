import React, {Component,} from 'react';
import PropTypes from 'prop-types';

import bootstrap from 'bootstrap/dist/css/bootstrap.css';

export default class Input extends Component {
  static defaultProps = {
    value: '',
    onChange: () => {},
    type: 'text',
    placeholder: '',
    isInvalid: false,
  };

  get value() {
    return this.input.value;
  }

  render() {
    const {
      id,
      value,
      onChange,
      type,
      placeholder,
      isInvalid,
      ...props
    } = this.props;

    return (
      <input className={`${bootstrap['form-control']} ${isInvalid ? bootstrap['is-invalid'] : ''}`}
        id={id}
        type={type}
        ref={c => {this.input = c;}}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  Input.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    onChange: PropTypes.func,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    isInvalid: PropTypes.bool,
  };
}
