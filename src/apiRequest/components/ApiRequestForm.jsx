import React from 'react';
import PropTypes from 'prop-types';

export const ApiRequestForm = ({children = null}) => (
  <div className="api-request-form container-fluid">
    {children}
  </div>
);

export default ApiRequestForm;

if (process.env.NODE_ENV !== 'production') {
  ApiRequestForm.propTypes = {
    children: PropTypes.node,
  };
}
