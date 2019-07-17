import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import {isUndefined} from 'lodash';

import CodeWidget from '../widgets/CodeWidget';
import Error from './../../../components/forms/Error';
import SchemaHint from './../SchemaHint';
import {
  getDefaultFormState,
  retrieveSchema,
  shouldRender,
  getDefaultRegistry,
  setState
} from 'react-jsonschema-form/lib/utils';

import jsyaml from 'js-yaml';

import {omitByRecursively, removeEmptyObjects} from '../utils';

class YamlField extends Component {
  nullValue = false;
  static defaultProps = {
    uiSchema: {},
    errorSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      value: {...this.getStateFromProps(props)}
    };
  }

  componentWillReceiveProps(nextProps) {
    const value = this.getStateFromProps(nextProps);
    this.setState({value});
  }

  getStateFromProps(props) {
    const {schema, formData, registry} = props;
    return getDefaultFormState(schema, formData, registry.definitions) || {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  asyncSetState(state, options = {validate: false}) {
    setState(this, state, () => {
      this.props.onChange(this.state.value, options);
    });
  }

  handlerCodeChange = value => {
    const errors = [];

    if (this.props.required && !value) {
      errors.push({
        message: 'required'
      });
    }

    try {
      value = jsyaml.safeLoad(value);
    } catch (e) {
      errors.push({
        message: 'Invalid YAML format!'
      });
    }

    this.asyncSetState({value, errors});
  };

  render() {
    const {
      name,
      required,
      idSchema,
      disabled,
      readonly,
    } = this.props;
    const {definitions, fields, formContext} = this.props.registry;
    const {TitleField, DescriptionField} = fields;
    const baseSchema = retrieveSchema(this.props.schema, definitions);
    let yamlValue = '';

    try {
      yamlValue = jsyaml.safeDump(removeEmptyObjects(omitByRecursively(this.state.value, isUndefined)));
    } catch (error) {
      yamlValue = '';
    }

    const title = (baseSchema.title === undefined) ? name : baseSchema.title;
    const schema = cloneDeep(baseSchema);
    const commonProps = {
      schema: {...schema, format: 'yaml'},
      id: idSchema && idSchema.$id,
      value: yamlValue,
      onChange: this.handlerCodeChange,
      required,
      disabled,
      readonly,
    };

    return (
      <fieldset className="gohan-reset-fieldset">
        {title && (
          <TitleField id={`${idSchema.$id}__title`}
            title={title}
            required={required}
            formContext={formContext}
          />
        )}
        {schema.description && (
          <DescriptionField id={`${idSchema.$id}__description`}
            description={schema.description}
            formContext={formContext}
          />
        )}
        {!schema.description && (
          <div className="clearfix" />
        )}
        <CodeWidget {...commonProps}/>
        <SchemaHint schema={baseSchema.properties}/>
        <Error errors={this.state.errors}/>
      </fieldset>

    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  YamlField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    errorSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
      ])).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    })
  };
}

export default YamlField;
