import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'react-flexbox-grid';

import Select from '../../components/Select.jsx';

const HttpMethodInput = ({
  methods = [],
  onChange = () => {},
  selectedMethod
}) => (
  <div className="request-form-section">
    <Row>
      <Col xs={12}
        className="input-label">
        <p>HTTP Method</p>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <Select items={methods}
          onSelect={onChange}
          selectedItem={selectedMethod}
        />
      </Col>
    </Row>
  </div>
);

export default HttpMethodInput;

if (process.env.NODE_ENV !== 'production') {
  HttpMethodInput.propTypes = {
    methods: PropTypes.array,
    onChange: PropTypes.func,
    selectedMethod: PropTypes.string.isRequired,
  };
}
