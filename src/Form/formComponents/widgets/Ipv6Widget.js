import React from 'react';
import PropTypes from 'prop-types';
import BaseInput from './BaseInput';

function Ipv6Widget(props) {
  return <BaseInput {...props} />;
}

Ipv6Widget.propTypes = {
  value: PropTypes.string,
};

export default Ipv6Widget;
