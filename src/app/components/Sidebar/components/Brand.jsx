import React from 'react';
import PropTypes from 'prop-types';

import styles from './brand.css';

const Brand = ({
  logoComponent = null,
  className = '',
  version = '',
  name,
}) => {
  return (
    <div className={`${styles.brand}${className ? ` ${className}` : ''}`}>
      {
        logoComponent && (
          logoComponent
        )
      }
      <div className={styles.brandTextContainer}>
        <h1 className={styles.brandName}>
          <a href="#">{name}</a>
        </h1>
        <div className={styles.brandVersion}>
          {
            version && <span>version: {version}</span>
          }
        </div>
      </div>
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Brand.propTypes = {
    logoComponent: PropTypes.node,
    version: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string.isRequired
  };
}

export default Brand;
