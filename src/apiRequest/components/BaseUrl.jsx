import React from 'react';
import PropTypes from 'prop-types';

const BaseUrl = ({
  baseUrl = '',
  queryList,
  onChange = () => {},
  query,
}) => (
  <div className="row form-group">
    <div className="col-sm-3 col-form-label text-sm-right">
      Base URL
    </div>
    {
      (queryList.length > 0) && (
        <div className="col-sm-5 text-muted">
          {baseUrl}
        </div>
      )
    }
    {
      (queryList.length > 0) && (
        <div className="col-sm-6">
          <select className="form-control" onChange={onChange}
            value={query}>
            {
              queryList && queryList.map((item, index) => (
                <option key={index}
                  value={item}>
                  {item}
                </option>
              ))
            }
          </select>
        </div>
      )
    }
    {
      (queryList.length === 0) && (
        <div className="col-sm-9 text-muted">
          {baseUrl}
        </div>
      )
    }
  </div>
);

export default BaseUrl;

if (process.env.NODE_ENV !== 'production') {
  BaseUrl.propTypes = {
    baseUrl: PropTypes.string,
    queryList: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    query: PropTypes.string.isRequired,
  };
}
