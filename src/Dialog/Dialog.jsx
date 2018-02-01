import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Form from 'react-jsonschema-form';
import {Dialog, ProgressBar, Intent, Button} from '@blueprintjs/core';
import isEqual from 'lodash/isEqual';

import {removeEmpty, toServerData} from './utils';
import {getSchema, getLoadingState} from './DialogSelectors';
import widgets from './formComponents/widgets';
import fields from './formComponents/fields';
import Template from './formComponents/Template';
import ErrorListTemplate from './formComponents/ErrorListTemplate';

import ErrorToast from './components/ErrorToast';

import {
  prepareSchema,
  clearData,
  clearError,
} from './DialogActions';
import {getUiSchemaProperties, getUiSchemaLogic} from './../uiSchema/UiSchemaSelectors';
/**
 * Dialog component for creating and editing resources.
 *
 * @class GeneratedDialog
 */
export class GeneratedDialog extends Component {
  /**
   * Reference to Form component.
   * @type {ReactElement}
   */
  form = null;

  /**
   * Prepares schema to before shows dialog.
   * @override
   */
  componentDidMount() {
    const {baseSchema, action} = this.props;

    this.props.prepareSchema(baseSchema.schema, action, baseSchema.parent);
  }

  componentWillReceiveProps(nextProps) {
    const {action} = this.props;

    if (!isEqual(this.props.baseSchema.schema, nextProps.baseSchema.schema)) {
      this.props.prepareSchema(nextProps.baseSchema.schema, action, nextProps.baseSchema.parent);
    }
  }

  /**
   * Clears all data from store.
   * @override
   */
  componentWillUnmount() {
    this.props.clearData();
  }


  /**
   * Handles submit event.
   * Calls onSubmit and onClose property callback.
   *
   * @param formData
   */
  handleSubmit = ({formData}) => {
    this.props.onSubmit(removeEmpty(toServerData(this.props.schema, formData)), this.props.data.id);
  };

  /**
   * Renders dialog component.
   * @override
   * @return {ReactElement} markup
   */
  render() {
    const {
      action,
      baseSchema,
      customTitle,
      customButtonLabel,
      schema,
      data
    } = this.props;
    const title = customTitle ? customTitle : `${action[0].toUpperCase() + action.slice(1)}` +
      ` ${baseSchema.title}`;
    const submitButtonLabel = customButtonLabel ? customButtonLabel : `${action[0].toUpperCase()}${action.slice(1)}`;

    return (
      <Dialog title={title}
        enforceFocus={false}
        {...this.props}>
        <div className="pt-dialog-body">
          <ErrorToast />
          {(() => {
            if (this.props.isLoading || schema === undefined) {
              return (
                <ProgressBar intent= {Intent.PRIMARY} />
              );
            }

            const {
              propertiesOrder,
              properties,
              required
            } = schema;

            return (
              <div>
                <Form ref={c => {this.form = c;}}
                  schema={schema}
                  fields={fields} widgets={widgets}
                  FieldTemplate={Template}
                  showErrorList={false}
                  noValidate={true} // workaround for fix ESI-16110
                  ErrorList={ErrorListTemplate}
                  formData={
                    propertiesOrder.reduce(
                      (result, item) => {
                        result[item] = data[item] !== undefined ?
                          data[item] :
                          required.includes(item) ? properties[item].default : undefined;
                        return result;
                      }, {}
                    )}
                  uiSchema={{
                    'ui:order': propertiesOrder,
                    'ui:logic': this.props.jsonUiSchemaLogic,
                    ...this.props.jsonUiSchema,
                    ...this.props.uiSchema
                  }}
                  onChange={this.props.onChange}
                  onSubmit={this.handleSubmit}>
                  <div/>
                </Form>
              </div>
            );
          })()}
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button text="Cancel"
              onClick={this.props.onClose}
            />
            <Button text={submitButtonLabel}
              intent={Intent.PRIMARY}
              onClick={event => {this.form.onSubmit(event);}}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}


GeneratedDialog.defaultProps = {
  action: 'create',
  data: {},
  onChange: () => {},
  onSubmit: () => {},
  uiSchema: {},
};

if (process.env.NODE_ENV !== 'production') {
  GeneratedDialog.propTypes = {
    prepareSchema: PropTypes.func.isRequired,
    clearData: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    schema: PropTypes.object,
    baseSchema: PropTypes.object.isRequired,
    action: PropTypes.oneOf([
      'create',
      'update'
    ]),
    formData: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    customTitle: PropTypes.string,
    customButtonLabel: PropTypes.string,
  };
}

const mapStateToProps = (state, {baseSchema}) => ({
  schema: getSchema(state),
  jsonUiSchema: getUiSchemaProperties(state, baseSchema.id),
  jsonUiSchemaLogic: getUiSchemaLogic(state, baseSchema.id),
  isLoading: getLoadingState(state),
});

export default connect(mapStateToProps, {
  prepareSchema,
  clearError,
  clearData,
})(GeneratedDialog);
