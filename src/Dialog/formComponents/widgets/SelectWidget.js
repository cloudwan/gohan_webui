import React, {PropTypes} from 'react';

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
  label,      // eslint-disable-line
  options,
  value,      // eslint-disable-line
  required,   // eslint-disable-line
  disabled,   // eslint-disable-line
  readonly,   // eslint-disable-line
  multiple,   // eslint-disable-line
  autofocus,  // eslint-disable-line
  onChange
}) {
  const {enumOptions} = options;

  const items = enumOptions.map(({value, label}, i) => {
    if (value === null) {
      return (
        <option key={i} value={''}>
          Choose an item...
        </option>
      );
    }
    return (
      <option key={i} value={value}>
        {label}
      </option>
    );
  });

  return (
    <div className="pt-select pt-fill">
      <select disabled={disabled} onChange={(event) => onChange(processValue(schema, event.target.value))}
        defaultValue={value}>
        {items}
      </select>
    </div>
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
