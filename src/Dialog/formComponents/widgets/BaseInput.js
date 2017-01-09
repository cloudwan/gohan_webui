import React, {PropTypes} from 'react';

function BaseInput(props) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the 'options' and 'schema' ones here.
  const {
    value,
    placeholder,
    onChange,
    label,        // eslint-disable-line
    required,     // eslint-disable-line
    readonly,     // eslint-disable-line
    autofocus,    // eslint-disable-line
    options,      // eslint-disable-line
    schema,       // eslint-disable-line
    formContext,  // eslint-disable-line
    ...inputProps // eslint-disable-line
  } = props;

  return (
    <input className="pt-input pt-fill" type="text"
      placeholder={placeholder} dir="auto"
      value={value === undefined ? '' : value} onChange={event => onChange(event.target.value)}
    />
  );
}

BaseInput.defaultProps = {
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  BaseInput.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default BaseInput;
