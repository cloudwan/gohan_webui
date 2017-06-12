import React, {Component} from 'react';
import {Spinner, Intent} from '@blueprintjs/core';

import './LoadingIndicator.scss';

export default class LoadingIndicator extends Component {
  render() {
    return (
      <div className="loading-container">
        <Spinner className="pt-large" intent={Intent.PRIMARY}/>
      </div>
    );
  }
}
