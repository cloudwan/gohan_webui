import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Toast} from '@blueprintjs/core';

import {getError} from './../DialogSelectors';

import {
  clearError,
} from './../DialogActions';

export class ErrorToast extends Component {
  handleToastDismiss = () => {
    this.props.clearError();
  };

  render() {
    const {
      errorMessage,
    } = this.props;

    if (!errorMessage) {
      return null;
    }
    return (
      <Toast message={errorMessage}
        className={'pt-intent-danger'}
        iconName={'error'}
        timeout={0}
        onDismiss={this.handleToastDismiss}
      />
    );
  }
}


ErrorToast.defaultProps = {
  errorMessage: ''
};

if (process.env.NODE_ENV !== 'production') {
  ErrorToast.propTypes = {
    errorMessage: PropTypes.string,
  };
}

export const mapStateToProps = state => ({
  errorMessage: getError(state),
});

export default connect(mapStateToProps, {
  clearError,
})(ErrorToast);
