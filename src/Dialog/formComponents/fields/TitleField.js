import React, {PropTypes} from 'react';

import './TitleField.scss';

const REQUIRED_FIELD_SYMBOL = '*';

function TitleField(props) {
  const {id, title, required, hiddenContent, onClick, children} = props;
  let showArrow = hiddenContent !== undefined;

  return (
    <legend id={id} className={`gohan-form__legend ${showArrow ? 'gohan-form__legend--cursor' : ''}`}
      onClick={onClick}>
      {title}
      {required ? <span className={'gohan-form__asterisk'}>{REQUIRED_FIELD_SYMBOL}</span> : null}
      {showArrow ? <span className={`gohan-form__caret-icon
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
