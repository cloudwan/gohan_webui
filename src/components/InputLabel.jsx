import React from 'react';
import ProtoTypes from 'prop-types';

export const InputLabel = ({children = null}) => (
  <label className="pt-label">
    {children}
  </label>
);

export default InputLabel;

if (process.env.NODE_ENV !== 'production') {
  InputLabel.propTypes = {
    children: ProtoTypes.node,
  };
}
