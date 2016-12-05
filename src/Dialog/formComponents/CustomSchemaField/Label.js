import React from 'react';

const REQUIRED_FIELD_SYMBOL = '*';

function Label(props) {
  const {label, required, id} = props;
  if (!label) {
    return <div />;
  }
  return (
    <label className='control-label' htmlFor={id}>
      {required ? label + REQUIRED_FIELD_SYMBOL : label}
    </label>
  );
}

export default Label;
