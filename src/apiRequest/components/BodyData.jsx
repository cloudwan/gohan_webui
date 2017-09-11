import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'react-flexbox-grid';

import JsonEditor from './JsonEditor';

const BodyData = ({
  code = '',
  onChange = () => {},
}) => (
  <div className="request-form-section">
    <Row>
      <Col xs={12} className="input-label">
        <p>BodyData</p>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <JsonEditor text={code}
          onChange={onChange}
        />
      </Col>
    </Row>
  </div>
);

export default BodyData;

if (process.env.NODE_ENV !== 'production') {
  BodyData.propTypes = {
    code: PropTypes.string,
    onChange: PropTypes.func,
  };
}
