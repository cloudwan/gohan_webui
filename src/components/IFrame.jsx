import React from 'react';
import PropTypes from 'prop-types';

export const IFrame = ({src}) => (
  <iframe className="gohan-iframe"
    src={src}
  />
);

export default IFrame;

if (process.env.NODE_ENV !== 'production') {
  IFrame.propTypes = {
    src: PropTypes.string.isRequired,
  };
}
