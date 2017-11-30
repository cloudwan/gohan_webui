import React from 'react';
import PropTypes from 'prop-types';

import styles from './Errors.css';

const Errors = ({errors}) => {
  if (errors && errors.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {errors.map((error, index) => (
        <div key={index}>{error.message}</div>
      ))}
    </div>
  );
};

export default Errors;

if (process.env.NODE_ENV !== 'production') {
  Errors.propTypes = {
    errors: PropTypes.array,
  };
}
