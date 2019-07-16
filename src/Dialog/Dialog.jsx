import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Form} from 'gohan-jsonschema-form';
import {Dialog, ProgressBar, Intent, Button} from '@blueprintjs/core';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import {stringify as queryStringify} from 'query-string';

import {removeEmpty, toServerData} from './utils';
import {getSchema, getLoadingState} from './DialogSelectors';
import {
  getTokenId,
} from '../auth/AuthSelectors';

import '../../css/dialog.scss';

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
  handleSubmit = values => {
    console.log('values', values);
    this.props.onSubmit(removeEmpty(toServerData(this.props.schema, values)), this.props.data.id);
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
      data,
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
            } = schema;

            return (
              <div>
                {(propertiesOrder.length === 0) && (
                  <span className="pt-empty-dialog-text">There are no properties that can be updated.</span>
                )}
                {(propertiesOrder.length > 0) && (
                  <Form schema={schema}
                    uiSchema={merge(this.props.jsonUiSchema, this.props.uiSchema)}
                    onSubmit={this.handleSubmit}
                    fetcher={async (url, query) => {

                      try {

                        const response = await fetch( // eslint-disable-line
                          `${url}?${queryStringify(query)}`,
                          {
                            method: 'GET',
                            headers: {
                              'Content-Type': 'application/json',
                              'X-Auth-Token': this.props.tokenId,
                            },
                            crossDomain: true,
                          }
                        );

                        const responseData = await response.json();

                        return responseData;
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    formData={data || {}}
                    ActionButtons={() => (
                      <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                          <Button text="Cancel"
                            onClick={this.props.onClose}
                          />
                          <Button text={submitButtonLabel}
                            intent={Intent.PRIMARY}
                            type="submit"
                            disabled={this.props.schema && this.props.schema.propertiesOrder.length === 0}
                          />
                        </div>
                      </div>
                    )}
                  />
                )}
              </div>
            );
          })()}
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
  tokenId: getTokenId(state),
});

export default connect(mapStateToProps, {
  prepareSchema,
  clearError,
  clearData,
})(GeneratedDialog);
