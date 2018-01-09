import React from 'react';
import PropTypes from 'prop-types';
import BaseInput from './BaseInput';


function CidrWidget(props) {
  return <BaseInput {...props} />;
}

CidrWidget.propTypes = {
  value: PropTypes.string,
};

export default CidrWidget;
