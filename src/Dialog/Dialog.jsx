import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Form from 'react-jsonschema-form';
import {Dialog, ProgressBar, Intent, Button} from '@blueprintjs/core';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';

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
import {
  getUiSchemaProperties,
  getUiSchemaTitle,
  getUiSchemaLogic
} from './../uiSchema/UiSchemaSelectors';
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

    this.props.prepareSchema(baseSchema.schema, action, baseSchema.parent, {
      ...merge(this.props.jsonUiSchema, this.props.uiSchema)
    });
  }

  componentWillReceiveProps(nextProps) {
    const {action} = this.props;

    if (!isEqual(this.props.baseSchema.schema, nextProps.baseSchema.schema)) {
      this.props.prepareSchema(nextProps.baseSchema.schema, action, nextProps.baseSchema.parent, {
        ...merge(this.props.jsonUiSchema, this.props.uiSchema)
      });
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
      ` ${this.props.uiSchemaTitle || baseSchema.title}`;
    const submitButtonLabel = customButtonLabel ? customButtonLabel : `${action[0].toUpperCase()}${action.slice(1)}`;

    return (
      <Dialog title={title}
        enforceFocus={false}
        canOutsideClickClose={false}
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
                {(propertiesOrder.length === 0) && (
                  <span className="pt-empty-dialog-text">There are no properties that can be updated.</span>
                )}
                {(propertiesOrder.length > 0) && (
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
                          if (data[item] !== undefined) {
                            result[item] = data[item];
                          } else if (required.includes(item)) {
                            result[item] = properties[item].type === 'object' && !properties[item].default ?
                              {} :
                              properties[item].default;
                          } else {
                            result[item] = undefined;
                          }

                          return result;
                        }, {}
                      )}
                    uiSchema={{
                      'ui:order': propertiesOrder,
                      'ui:logic': this.props.jsonUiSchemaLogic,
                      ...merge(this.props.jsonUiSchema, this.props.uiSchema),
                    }}
                    onChange={this.props.onChange}
                    onSubmit={this.handleSubmit}>
                    <div/>
                  </Form>
                )}
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
              disabled={this.props.schema && this.props.schema.propertiesOrder.length === 0}
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
  uiSchemaTitle: getUiSchemaTitle(state, baseSchema.id),
  jsonUiSchemaLogic: getUiSchemaLogic(state, baseSchema.id),
  isLoading: getLoadingState(state),
});

export default connect(mapStateToProps, {
  prepareSchema,
  clearError,
  clearData,
})(GeneratedDialog);
