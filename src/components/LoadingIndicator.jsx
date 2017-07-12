import React from 'react';
import {Spinner, Intent} from '@blueprintjs/core';

export const LoadingIndicator = () => (
  <div className="loading-container">
    <Spinner className="pt-large loading-spinner"
      intent={Intent.PRIMARY}
    />
  </div>
);

export default LoadingIndicator;
