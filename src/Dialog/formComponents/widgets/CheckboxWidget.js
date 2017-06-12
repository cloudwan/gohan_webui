import React, {PropTypes} from 'react';

import './CheckboxWidget.scss';

function CheckboxWidget({
  schema,  // eslint-disable-line
  id,
  value,
  required,
  disabled,// eslint-disable-line
  label,
  autofocus,
  onChange,
}) {
  return (
    <label className={'pt-control gohan-form__checkbox pt-checkbox'}>
      <input type='checkbox'
        id={id}
        checked={typeof value === 'undefined' ? false : value}
        required={required}
        disabled={disabled}
        autoFocus={autofocus}
        onChange={event => onChange(event.target.checked)}
      />
      <span className="pt-control-indicator"/>
      {label}
    </label>
  );
}

CheckboxWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  CheckboxWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxWidget;
