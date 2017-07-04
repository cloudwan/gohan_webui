import React from 'react';
import PropTypes from 'prop-types';

import BaseInput from './BaseInput';

function EmailWidget(props) {
  return <BaseInput type='email' {...props} />;
}

EmailWidget.propTypes = {
  value: PropTypes.string,
};

export default EmailWidget;
