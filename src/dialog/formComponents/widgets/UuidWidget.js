import React, {PropTypes} from 'react';
import BaseInput from './BaseInput';


function UuidWidget(props) {
  return <BaseInput {...props} />;
}

UuidWidget.propTypes = {
  value: PropTypes.string,
};

export default UuidWidget;
