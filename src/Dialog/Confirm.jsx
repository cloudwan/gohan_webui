import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Dialog, Intent, Button} from '@blueprintjs/core';

import ErrorToast from './components/ErrorToast';

import {
  clearError,
} from './DialogActions';

export class Confirm extends Component {
  handleSubmit = ({formData}) => {
    this.props.onSubmit(formData, this.props.data.id);
  };

  render() {
    const {
      title,
      iconName,
      text,
      onSubmit,
    } = this.props;

    return (
      <Dialog title={title}
        {...this.props}
        {...{iconName}}>
        <ErrorToast />
        <div className="pt-dialog-body">
          {text}
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button text="Cancel"
              onClick={this.props.onClose}
            />
            <Button text="Execute"
              intent={Intent.PRIMARY}
              onClick={onSubmit}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}


Confirm.defaultProps = {
  onSubmit: () => {},
};

if (process.env.NODE_ENV !== 'production') {
  Confirm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    iconName: PropTypes.string,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  clearError,
})(Confirm);
