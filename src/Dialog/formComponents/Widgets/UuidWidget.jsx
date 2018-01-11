import React from 'react';
import PropTypes from 'prop-types';
import BaseInput from './BaseInput';


function UuidWidget(props) {
  return <BaseInput {...props} />;
}

UuidWidget.propTypes = {
  value: PropTypes.string,
};

export default UuidWidget;
