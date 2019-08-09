import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import JSONSchemaForm from 'react-jsonschema-form';
import {ProgressBar, Intent} from '@blueprintjs/core';

import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';

import {
  getUiSchemaLogic,
  getUiSchemaProperties,
  getUiSchemaTitle
} from '../uiSchema/UiSchemaSelectors';

import fields from './formComponents/fields';
import widgets from './formComponents/widgets';
import Template from './formComponents/Template';
import ErrorListTemplate from './formComponents/ErrorListTemplate';
import {
  getLoadingState,
  getSchema,
  getError
} from './FormSelectors';
import {
  prepareSchema,
  clearData,
  clearError
} from './FormActions';
import {removeEmpty, toServerData, prepareFormData} from './utils';

/**
 * Form component for creating and editing resources
 *
 * @class Form
 */
export class Form extends Component {

  /**
   * Reference to React JSON Schema Form component
   * @type {ReactElement}
   */
  form = null;

  /**
   * Prepares schema to before shows dialog.
   * @override
   */
  componentDidMount() {
    const {baseSchema, action, formName} = this.props;

    this.props.onRef(this);
    this.props.prepareSchema(formName, baseSchema.schema, action, baseSchema.parent, {
      ...merge(this.props.jsonUiSchema, this.props.uiSchema)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentWillReceiveProps(nextProps) {
    const {action, formName} = this.props;

    if (!isEqual(this.props.baseSchema.schema, nextProps.baseSchema.schema)) {
      this.props.prepareSchema(formName, nextProps.baseSchema.schema, action, nextProps.baseSchema.parent, {
        ...merge(this.props.jsonUiSchema, this.props.uiSchema)
      });
    }
    if (this.props.updateParentSubmitButtonDisabled !== undefined) {
      if (!isEqual(nextProps.schema, this.props.schema) || Object.keys(nextProps.schema).length > 0) {
        this.props.updateParentSubmitButtonDisabled(nextProps.schema && nextProps.schema.propertiesOrder.length === 0);
      }
    }
  }

  /**
   * Clears all data from store.
   * @override
   */
  componentWillUnmount() {
    this.props.onRef(null);
    this.props.clearData(this.props.formName);

    if (this.props.clearParentError !== undefined) {
      this.props.clearParentError();
    }
  }

  triggerSubmit = event => {
    this.form.onSubmit(event);
  };

  /**
   * Handles submit event.
   * Calls onSubmit and onClose property callback.
   *
   * @param formData
   */
  handleSubmit = ({formData}) => {
    this.props.onSubmit(removeEmpty(toServerData(this.props.schema, formData)), this.props.data.id);
  };

  createFormRef = ref => (this.form = ref);

  /**
   * Renders dialog component.
   * @override
   * @return {ReactElement} markup
   */
  render() {
    const {isLoading, schema, data, error, ActionButtons} = this.props;

    if (isLoading || schema === undefined) {
      return (
        <ProgressBar intent={Intent.PRIMARY} />
      );
    }

    const {propertiesOrder, properties, required} = schema;
    const formData = propertiesOrder && propertiesOrder.length > 0 ?
      prepareFormData(properties, propertiesOrder, required, data) :
      {};
    const uiSchema = {
      'ui:order': propertiesOrder,
      'ui:logic': this.props.jsonUiSchemaLogic,
      ...merge(this.props.jsonUiSchema, this.props.uiSchema),
    };

    return (
      <div>
        {(error && !isLoading && (
          <div className="form-error">error: {error}</div>
        ))}
        {(!propertiesOrder || propertiesOrder.length === 0) && (
          <span className="pt-empty-dialog-text">There are no properties that can be updated.</span>
        )}
        {(propertiesOrder && propertiesOrder.length > 0) && (
          <JSONSchemaForm ref={this.createFormRef}
            schema={schema}
            fields={fields} widgets={widgets}
            FieldTemplate={Template}
            showErrorList={false}
            noValidate={true} // workaround for fix ESI-16110
            ErrorList={ErrorListTemplate}
            formData={formData}
            uiSchema={uiSchema}
            onChange={this.props.onChange}
            onSubmit={this.handleSubmit}>
            <div/>
          </JSONSchemaForm>
        )}
        {(ActionButtons)}
      </div>
    );
  }
}

Form.defaultProps = {
  data: {},
  schema: {}
};

const mapStateToProps = (state, {baseSchema, formName}) => ({
  schema: getSchema(state, formName),
  jsonUiSchema: getUiSchemaProperties(state, baseSchema.id),
  uiSchemaTitle: getUiSchemaTitle(state, baseSchema.id),
  jsonUiSchemaLogic: getUiSchemaLogic(state, baseSchema.id),
  isLoading: getLoadingState(state, formName),
  error: getError(state, formName)
});

const mapDispatchToProps = {
  prepareSchema,
  clearError,
  clearData
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);

if (process.env.NODE_ENV !== 'production') {
  Form.propTypes = {
    // schema selectors
    jsonUiSchema: PropTypes.object,
    jsonUiSchemaLogic: PropTypes.object,
    uiSchemaTitle: PropTypes.string,
    // form actions
    prepareSchema: PropTypes.func,
    clearData: PropTypes.func,
    clearError: PropTypes.func,
    // form selectors
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    schema: PropTypes.object,
    // parent's props
    formName: PropTypes.string.isRequired,
    baseSchema: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['create', 'update']),
    onSubmit: PropTypes.func.isRequired,
    customButtonLabel: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
    ActionButtons: PropTypes.element,
    clearParentError: PropTypes.func,
    updateParentSubmitButtonDisabled: PropTypes.func
  };
}
