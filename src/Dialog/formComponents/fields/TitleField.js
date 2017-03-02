import React, {PropTypes} from 'react';

const REQUIRED_FIELD_SYMBOL = '*';

function TitleField(props) {
  const {id, title, required} = props;

  return (
    <legend id={id} className="gohan-form-legend">
      {title}
      {required ? <span className={'gohan-form-asterisk'}>{REQUIRED_FIELD_SYMBOL}</span> : null}
    </legend>
  );
}

if (process.env.NODE_ENV !== 'production') {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
  };
}

export default TitleField;
