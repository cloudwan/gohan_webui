import React, {Component} from 'react';
import {RefreshIndicator} from 'material-ui';

const loadingIndicatorStyle = {
  margin: 'auto',
  position: 'relative'
};

export default class LoadingIndicator extends Component {
  render() {
    return (
      <RefreshIndicator size={60} left={0}
        top={0} status="loading"
        style={loadingIndicatorStyle}
      />
    );
  }
}
