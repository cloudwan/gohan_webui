import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({className, children}) => {
  if (!children) {
    return null;
  }

  return (
    <div className={`gohan-footer${className ? ' ' + className : ''}`}>
      <span className="gohan-footer-text">{children}</span>
    </div>
  );
};

Footer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Footer;
