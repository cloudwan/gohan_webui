import React from 'react';
import PropTypes from 'prop-types';

const REQUIRED_FIELD_SYMBOL = '*';

function TitleField(props) {
  const {id, title, required, hiddenContent, onClick, children} = props;
  let showArrow = hiddenContent !== undefined;

  return (
    <legend id={id} className={`gohan-form-legend ${showArrow ? 'gohan-form-title-cursor' : ''}`}
      onClick={onClick}>
      {title}
      {required ? <span className={'gohan-form-asterisk'}>{REQUIRED_FIELD_SYMBOL}</span> : null}
      {showArrow ? <span className={`gohan-caret-icon
                          pt-icon-standard pt-icon-caret-${hiddenContent ? 'up' : 'down'}`}
      /> : null}
      {children}
    </legend>
  );
}

if (process.env.NODE_ENV !== 'production') {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
    hiddenContent: PropTypes.bool,
    onClick: PropTypes.func
  };
}

export default TitleField;
