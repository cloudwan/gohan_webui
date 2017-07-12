import React from 'react';
import ProtoTypes from 'prop-types';

export const Input = (
  {
    value = '',
    onChange = () => {},
    isFill = false,
    type = 'text',
    placeholder = '',
  }
) => (
  <input className={`pt-input${isFill ? ' pt-fill' : ''}`}
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
  />
);

export default Input;

if (process.env.NODE_ENV !== 'production') {
  Input.propTypes = {
    value: ProtoTypes.oneOfType([
      ProtoTypes.string,
      ProtoTypes.number,
    ]),
    onChange: ProtoTypes.func,
    isFill: ProtoTypes.bool,
    type: ProtoTypes.string,
    placeholder: ProtoTypes.string,
  };
}
