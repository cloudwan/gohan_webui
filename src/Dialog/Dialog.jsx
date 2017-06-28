import React, {Component, PropTypes} from 'react';
import {Dialog, Button, ProgressBar, Intent} from '@blueprintjs/core';
import {connect} from 'react-redux';
import Form from 'react-jsonschema-form';

import {getSchema, getLoadingState} from './DialogSelectors';
import widgets from './formComponents/widgets';
import fields from './formComponents/fields';
import Template from './formComponents/Template';

import {prepareSchema, clearData} from './DialogActions';
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
    this.props.onSubmit(formData, this.props.data.id);
  };

  /**
   * Renders dialog component.
   * @override
   * @return {ReactElement} markup
   */
  render() {
    const {action, baseSchema, customTitle} = this.props;
    const title = customTitle ? customTitle : `${action[0].toUpperCase() + action.slice(1)}` +
      `${action === 'create' ? ' new ' : ' '}${baseSchema.title}`;
    const actions = [];

    actions.push(
      <Button key={actions.length} text="Cancel"
        onClick={this.props.onClose}
      />
    );
    actions.push(
      <Button key={actions.length} text="Submit"
        intent={Intent.PRIMARY} onClick={event => {
          this.form.onSubmit(event);
        }}
      />
    );

    return (
      <Dialog title={title} actions={actions}
        autoScrollBodyContent={true}
        {...this.props}>
        <div className="pt-dialog-body">
          {(() => {
            if (this.props.isLoading || this.props.schema === undefined) {
              return (
                <ProgressBar/>
              );
            }

            return (
              <div>
                <Form ref={c => {this.form = c;}} schema={this.props.schema}
                  fields={fields} widgets={widgets}
                  FieldTemplate={Template} formData={
                    this.props.schema.propertiesOrder.reduce(
                      (result, item) => {
                        result[item] = this.props.data[item];
                        return result;
                      }, {}
                    )}
                  uiSchema={{
                    'ui:order': this.props.schema.propertiesOrder,
                    'ui:logic': this.props.jsonUiSchemaLogic,
                    ...this.props.jsonUiSchema,
                    ...this.props.uiSchema
                  }}
                  onSubmit={this.handleSubmit} showErrorList={false}
                  noValidate={true}>
                  <div/>
                </Form>
              </div>
            );
          })()}
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            {actions}
          </div>
        </div>
      </Dialog>
    );
  }
}


GeneratedDialog.defaultProps = {
  action: 'create',
  data: {},
  onSubmit: () => {},
  uiSchema: {}
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
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    customTitle: PropTypes.string
  };
}

const mapStateToProps = (state, {baseSchema}) => ({
  schema: getSchema(state),
  jsonUiSchema: getUiSchemaProperties(state, baseSchema.id),
  jsonUiSchemaLogic: getUiSchemaLogic(state, baseSchema.id),
  isLoading: getLoadingState(state)
});

export default connect(mapStateToProps, {
  prepareSchema,
  clearData
})(GeneratedDialog);
