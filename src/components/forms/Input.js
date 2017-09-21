import React from 'react';
import ProtoTypes from 'prop-types';

import bootstrap from 'bootstrap/dist/css/bootstrap.css';

export const Input = (
  {
    id,
    value = '',
    onChange = () => {},
    type = 'text',
    placeholder = '',
  }
) => (
  <input className={`${bootstrap['form-control']}`}
    id={id}
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
  />
);

export default Input;

if (process.env.NODE_ENV !== 'production') {
  Input.propTypes = {
    id: ProtoTypes.string.isRequired,
    value: ProtoTypes.oneOfType([
      ProtoTypes.string,
      ProtoTypes.number,
    ]),
    onChange: ProtoTypes.func,
    type: ProtoTypes.string,
    placeholder: ProtoTypes.string,
  };
}
