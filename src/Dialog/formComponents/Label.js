import React from 'react';

const REQUIRED_FIELD_SYMBOL = '*';

function Label(props) {
  const {label, required, id} = props;

  if (!label) {
    return <div />;
  }

  return (
    <legend id={id}>
      {label}
      {required ? <span className={'form-asterisk'}>{REQUIRED_FIELD_SYMBOL}</span> : null}
    </legend>
  );
}

export default Label;
