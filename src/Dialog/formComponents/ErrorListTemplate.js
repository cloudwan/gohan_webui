import React, {Component} from 'react';
import {Toast} from '@blueprintjs/core';

export default class ErrorListTemplate extends Component {
  handleDismissToast = () => {
    this.props.toggleErrorListVisibility(false);
  };

  render() {
    const {errors} = this.props;

    if (Array.isArray(errors) && errors.length === 0) {
      return null;
    }

    return (
      <div>
        <Toast message={errors.reduce(
          (result, error, index) =>
            result + `${error.message}${index === errors.length - 1 ? '.' : ', '}`, 'Validation error: '
        )}
          className={'pt-intent-danger'}
          iconName={'error'}
          timeout={0}
          onDismiss={this.handleDismissToast}
        />
      </div>
    );
  }
}
