import React, {PropTypes} from 'react';
import {SelectField, MenuItem} from 'material-ui';

import {asNumber} from 'react-jsonschema-form/lib/utils';

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({type, items}, value) {
  if (type === 'array' && items && ['number', 'integer'].includes(items.type)) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }
  return value;
}

function SelectWidget({
  schema,
  label,
  options,
  value,
  required,
  disabled,
  readonly,   // eslint-disable-line
  multiple,   // eslint-disable-line
  autofocus,  // eslint-disable-line
  onChange
}) {
  const {enumOptions} = options;

  const items = enumOptions.map(({value, label}, i) => {
    if (value === null) {
      return (
        <MenuItem key={i} value={value}
          primaryText={''}
        />
      );
    }
    return (
      <MenuItem key={i} value={value}
        primaryText={label}
      />
    );
  });

  return (
    <SelectField floatingLabelText={label + (required ? '*' : '')} value={value}
      disabled={disabled} onChange={(event, key, newValue) => {
        onChange(processValue(schema, newValue));
      }} fullWidth={true}>
      {items}
    </SelectField>
  );
}

SelectWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default SelectWidget;
