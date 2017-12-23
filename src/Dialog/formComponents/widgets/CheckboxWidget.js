import React from 'react';
import PropTypes from 'prop-types';

function CheckboxWidget({
  schema,  // eslint-disable-line
  id,
  value,
  required,
  disabled,// eslint-disable-line
  label,
  autofocus,
  onChange
}) {
  const defaultValue = typeof schema.default === 'undefined' ? false : schema.default;
  const checked = typeof value === 'undefined' ? defaultValue : value;

  return (
    <div className="form-check">
      <label className="form-check-label">
        <input className="form-check-input"
          type='checkbox'
          id={id}
          checked={checked}
          required={required}
          disabled={disabled}
          autoFocus={autofocus}
          onChange={event => onChange(event.target.checked)}
        />
        {label}
      </label>
    </div>
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
