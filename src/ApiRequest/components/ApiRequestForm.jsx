import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'react-flexbox-grid';

export const ApiRequestForm = ({children = null}) => (
  <Row center="xs" className="request-form">
    <Col xs={12}>
      {children}
    </Col>
  </Row>
);

export default ApiRequestForm;

if (process.env.NODE_ENV !== 'production') {
  ApiRequestForm.propTypes = {
    children: PropTypes.node,
  };
}
