import React, {PropTypes} from 'react';
import BaseInput from './BaseInput';


function CidrWidget(props) {
  return <BaseInput {...props} />;
}

CidrWidget.propTypes = {
  value: PropTypes.string,
};

export default CidrWidget;
