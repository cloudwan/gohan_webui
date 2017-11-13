import React from 'react';
import PropTypes from 'prop-types';

import bootstrap from 'bootstrap/dist/css/bootstrap.css';

function Error(props) {
  const {errors} = props;

  if (errors && errors.length === 0) {
    return null;
  }

  return (
    <div className={bootstrap['invalid-feedback']}>
      {errors.map((error, index) => {
        return (
          <div key={index}>{error.message}</div>
        );
      })}
    </div>
  );
}

export default Error;

if (process.env.NODE_ENV !== 'production') {
  Error.propTypes = {
    errors: PropTypes.array
  };
}
