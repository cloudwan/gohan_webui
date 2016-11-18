import React, {PropTypes} from 'react';
import BaseInput from './BaseInput';


function MacWidget(props) {
  return <BaseInput {...props} />;
}

MacWidget.propTypes = {
  value: PropTypes.string,
};

export default MacWidget;
