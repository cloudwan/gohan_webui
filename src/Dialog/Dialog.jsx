import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Dialog, Intent, Button} from '@blueprintjs/core';
import {getLoadingState} from './DialogSelectors';

import ErrorToast from './components/ErrorToast';
import Form from './../Form';

import {
  clearError,
} from './DialogActions';
/**
 * Dialog component for creating and editing resources.
 *
 * @class GeneratedDialog
 */
export class GeneratedDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitButtonDisabled: true
    };
  }
  /**
   * Reference to Form component.
   * @type {ReactElement}
   */
  formWrapper = null;

  /**
   * Handles submit event.
   * Calls onSubmit and onClose property callback.
   *
   * @param event
   */
  handleSubmit = event => {
    this.formWrapper.triggerSubmit(event);
  };

  updateSubmitButtonDisabled = disabled => {
    this.setState({submitButtonDisabled: disabled});
  };

  createFormWrapperRef = ref => (this.formWrapper = ref);

  /**
   * Renders dialog component.
   * @override
   * @return {ReactElement} markup
   */
  render() {
    const {
      action,
      baseSchema,
      uiSchema,
      customTitle,
      customButtonLabel,
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
          <Form formName="dialog_form"
            onRef={this.createFormWrapperRef}
            action={action}
            baseSchema={baseSchema}
            uiSchema={uiSchema}
            data={data}
            onSubmit={this.props.onSubmit}
            onChange={this.props.onChange}
            clearParentError={this.props.clearError}
            updateParentSubmitButtonDisabled={this.updateSubmitButtonDisabled}
          />
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button text="Cancel"
              onClick={this.props.onClose}
            />
            <Button text={submitButtonLabel}
              intent={Intent.PRIMARY}
              onClick={this.handleSubmit}
              disabled={this.state.submitButtonDisabled}
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
    isOpen: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    baseSchema: PropTypes.object.isRequired,
    action: PropTypes.oneOf([
      'create',
      'update'
    ]),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    customTitle: PropTypes.string,
    customButtonLabel: PropTypes.string,
  };
}

const mapStateToProps = state => ({
  isLoading: getLoadingState(state),
});

export default connect(mapStateToProps, {
  clearError,
})(GeneratedDialog);
