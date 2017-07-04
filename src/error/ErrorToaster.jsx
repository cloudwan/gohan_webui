import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {resetErrorMessage} from './../error/ErrorActions';

import {Toaster, Position} from '@blueprintjs/core';


class ErrorToaster extends Component {

  handleDismissClick = () => {
    this.props.resetErrorMessage();
  }

  componentWillReceiveProps(nextProps) {
    const message = nextProps.errorMessage;

    if (message) {
      this.toaster.show({
        message,
        className: 'pt-intent-danger',
        timeout: 0,
        onDismiss: this.handleDismissClick
      });
    }
  }

  render() {
    return (
      <Toaster position={Position.TOP} ref={ref => {this.toaster = ref;}}
        dismiss={0}
      />
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  ErrorToaster.propTypes = {
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func
  };
}

function mapStateToProps(state) {
  return {
    errorMessage: state.errorReducer
  };
}

export default connect(mapStateToProps, {
  resetErrorMessage,
})(ErrorToaster);
