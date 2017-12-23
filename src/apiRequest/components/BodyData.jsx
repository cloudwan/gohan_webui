import React from 'react';
import PropTypes from 'prop-types';

import JsonEditor from './JsonEditor';

const BodyData = ({
  code = '',
  onChange = () => {},
}) => (
  <div className="row form-group">
    <div className="col-sm-3 col-form-label text-sm-right">
      BodyData
    </div>
    <div className="col-sm-9">
      <JsonEditor text={code}
        onChange={onChange}
      />
    </div>
  </div>
);

export default BodyData;

if (process.env.NODE_ENV !== 'production') {
  BodyData.propTypes = {
    code: PropTypes.string,
    onChange: PropTypes.func,
  };
}
