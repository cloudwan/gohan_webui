import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
} from 'react-flexbox-grid';
import {
  Popover,
  Position,
  Tooltip,
} from '@blueprintjs/core';

import Select from '../../components/Select';
import Input from '../../components/Input';

const UrlInput = ({
  baseUrl = '',
  queryList,
  onChange = () => {},
  query,
}) => (
  <div className="request-form-section">
    <Row>
      <Col xs={12} className="input-label">
        <p>URL
          <Popover position={Position.TOP}>
            <Tooltip position={Position.TOP}
              content={
                <p>
                  You can see this API Request result in the browser console<br/>
                  Metrics query example: /metrics?start=1h-ago
                </p>
              }>
              <span className="pt-icon-standard pt-icon-info-sign info-icon" />
            </Tooltip>
          </Popover>
        </p>
      </Col>
    </Row>
    <Row>
      <Col xs={3}>
        <p className="base-url"
          title={baseUrl}>
          {baseUrl}
        </p>
      </Col>
      <Col xs={9}>
        {
          (queryList.length > 0) && (
            <Select items={queryList}
              onSelect={onChange}
              selectedItem={query}
            />
          )
        }
        {
          (queryList.length === 0) && (
            <Input isFill={true}
              onChange={onChange}
              value={query}
              placeholder='ex: /metrics?start=1h-ago'
            />
          )
        }
      </Col>
    </Row>
  </div>
);

export default UrlInput;

if (process.env.NODE_ENV !== 'production') {
  UrlInput.propTypes = {
    baseUrl: PropTypes.string,
    queryList: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    query: PropTypes.string.isRequired,
  };
}
