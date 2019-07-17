import React from 'react';
import PropTypes from 'prop-types';
import BaseInput from './BaseInput';

function Ipv4Widget(props) {
  return <BaseInput {...props} />;
}

Ipv4Widget.propTypes = {
  value: PropTypes.string,
};

export default Ipv4Widget;
