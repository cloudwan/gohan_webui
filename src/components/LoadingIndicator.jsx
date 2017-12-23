import React from 'react';
import {Spinner, Intent} from '@blueprintjs/core';

export const LoadingIndicator = () => (
  <div className="loading-container d-flex justify-content-center align-items-center">
    <Spinner intent={Intent.PRIMARY} />
  </div>
);

export default LoadingIndicator;
