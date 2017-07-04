import React from 'react';
import PropTypes from 'prop-types';
import BaseInput from './BaseInput';


function MacWidget(props) {
  return <BaseInput {...props} />;
}

MacWidget.propTypes = {
  value: PropTypes.string,
};

export default MacWidget;
