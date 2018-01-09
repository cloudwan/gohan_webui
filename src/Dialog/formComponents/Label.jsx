import React from 'react';

import Label from './../../components/Forms/Label';
import Asterisk from './../../components/Forms/Asterisk';

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
