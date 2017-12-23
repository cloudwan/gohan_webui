import React from 'react';
import PropTypes from 'prop-types';

const HttpMethodInput = ({
  methods = [],
  onChange = () => {},
  selectedMethod
}) => (
  <div className="row form-group">
    <div className="col-sm-3 col-form-label text-sm-right">
      HTTP Method
    </div>
    <div className="col-sm-9">
      <select className="form-control" onChange={onChange}
        value={selectedMethod}>
        {
          methods && methods.map((item, index) => (
            <option key={index}
              value={item}>
              {item}
            </option>
          ))
        }
      </select>
    </div>
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
