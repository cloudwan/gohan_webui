import React from 'react';
import PropTypes from 'prop-types';

const UrlInput = ({
  onChange = () => {},
  additionalQuery,
}) => (
  <div className="row form-group">
    <div className="col-sm-3 col-form-label text-sm-right">
      Additional Query
    </div>
    <div className="col-sm-9">
      <input className="form-control" onChange={onChange}
        value={additionalQuery} type="text"
      />
      <small className="form-text text-muted">ex: /metrics?start=1h-ago</small>
    </div>
  </div>
);

export default UrlInput;

if (process.env.NODE_ENV !== 'production') {
  UrlInput.propTypes = {
    onChange: PropTypes.func,
    additionalQuery: PropTypes.string,
  };
}
