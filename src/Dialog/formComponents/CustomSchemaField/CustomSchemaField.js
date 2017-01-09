import React, {PropTypes} from 'react';
import {
  isMultiSelect,
  retrieveSchema,
  getDefaultRegistry,
  isFilesArray
} from 'react-jsonschema-form/lib/utils';

import ArrayField from '../fields/ArrayField';
import BooleanField from '../fields/BooleanField';
import NumberField from '../fields/NumberField';
import ObjectField from '../fields/ObjectField';
import StringField from '../fields/StringField';
import UnsupportedField from '../fields/UnsupportedField';
import DescriptionField from '../fields/DescriptionField';

import Help from './Help';
import ErrorList from './ErrorList';
import DefaultTemplate from './DefaultTemplate';

const COMPONENT_TYPES = {
  array: ArrayField,
  boolean: BooleanField,
  integer: NumberField,
  number: NumberField,
  object: ObjectField,
  string: StringField,
};

function getFieldComponent(schema, uiSchema, fields) {
  const field = uiSchema['ui:field'];
  if (typeof field === 'function') {
    return field;
  }
  if (typeof field === 'string' && field in fields) {
    return fields[field];
  }
  return COMPONENT_TYPES[schema.type] || UnsupportedField;
}

function SchemaField(props) {
  const {uiSchema, errorSchema, idSchema, name, required, registry} = props;
  const {definitions, fields, formContext, FieldTemplate = DefaultTemplate} = registry;
  const schema = retrieveSchema(props.schema, definitions);
  const FieldComponent = getFieldComponent(schema, uiSchema, fields);
  const disabled = Boolean(props.disabled || uiSchema['ui:disabled']);
  const readonly = Boolean(props.readonly || uiSchema['ui:readonly']);
  const autofocus = Boolean(props.autofocus || uiSchema['ui:autofocus']);

  if (Object.keys(schema).length === 0) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }

  let displayLabel = true;
  if (schema.type === 'array') {
    displayLabel = isMultiSelect(schema) || isFilesArray(schema, uiSchema);
  }
  if (schema.type === 'object') {
    displayLabel = false;
  }
  if (schema.type === 'boolean' && !uiSchema['ui:widget']) {
    displayLabel = false;
  }
  if (uiSchema['ui:field']) {
    displayLabel = false;
  }

  const field = (
    <FieldComponent {...props}
      schema={schema}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      formContext={formContext}
    />
  );

  const {type} = schema;
  const id = idSchema.$id;
  const label = props.schema.title || schema.title || name;
  const description = props.schema.description || schema.description;
  const errors = errorSchema.__errors;
  const help = uiSchema['ui:help'];
  const hidden = uiSchema['ui:widget'] === 'hidden';
  const classNames = [
    'form-group',
    'field',
    `field-${type}`,
    errors && errors.length > 0 ? 'field-error has-error' : '',
    uiSchema.classNames,
  ].join(' ').trim();

  const fieldProps = {
    description: <DescriptionField id={id + '__description'}
      description={description}
      formContext={formContext}
    />,
    help: <Help help={help} />,
    errors: <ErrorList errors={errors} />,
    id,
    label,
    hidden,
    required,
    readonly,
    displayLabel,
    classNames,
    formContext,
  };

  return <FieldTemplate {...fieldProps}>{field}</FieldTemplate>;
}

SchemaField.defaultProps = {
  uiSchema: {},
  errorSchema: {},
  idSchema: {},
  registry: getDefaultRegistry(),
  disabled: false,
  readonly: false,
  autofocus: false,
};

SchemaField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  idSchema: PropTypes.object,
  formData: PropTypes.any,
  errorSchema: PropTypes.object,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ])).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    FieldTemplate: PropTypes.func,
    formContext: PropTypes.object.isRequired,
  })
};

export default SchemaField;
