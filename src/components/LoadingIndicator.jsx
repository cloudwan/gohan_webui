import React, {Component} from 'react';
import {Spinner, Intent} from '@blueprintjs/core';

export default class LoadingIndicator extends Component {
  render() {
    return (
      <Spinner className="pt-large loading-spinner" intent={Intent.PRIMARY}/>
    );
  }
}
