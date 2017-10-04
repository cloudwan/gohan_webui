import React from 'react';
import PropTypes from 'prop-types';
import styles from './logo.css';

const Logo = ({
  logoPath,
  width,
  height,
  href = '#',
  className = '',
  paddingHorizontal = 0,
  paddingVertical = 0,
}) => {
  return (
    <a href={href}>
      <div className={`${styles.logo} ${className ? ` ${className}` : ''}`}
        style={{
          backgroundImage: `url(${logoPath})`,
          backgroundPosition: `${paddingHorizontal}px ${paddingVertical}px`,
          backgroundSize: `${width - (2 * paddingHorizontal)}px ${height - (2 * paddingVertical)}px`,
          width,
          height,
        }}
      />
    </a>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Logo.propTypes = {
    logoPath: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    href: PropTypes.string,
    className: PropTypes.string,
    paddingHorizontal: PropTypes.number,
    paddingVertical: PropTypes.number,
  };
}

export default Logo;
