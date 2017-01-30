import React, {Component} from 'react';
import {Spinner, Intent} from '@blueprintjs/core';

export default class LoadingIndicator extends Component {
  render() {
    return (
      <div className="loading-container">
        <Spinner className="pt-large loading-spinner" intent={Intent.PRIMARY}/>
      </div>
    );
  }
}
