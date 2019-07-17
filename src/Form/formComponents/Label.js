import React from 'react';

import Label from './../../components/forms/Label';
import Asterisk from './../../components/forms/Asterisk';

function LabelDialogLabel(props) {
  const {label, required, id} = props;

  if (!label) {
    return <div />;
  }

  return (
    <Label htmlFor={id}>
      {label}
      {required && <Asterisk/>}
    </Label>
  );
}

export default LabelDialogLabel;
