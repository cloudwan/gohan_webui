import React from 'react';
import {Button} from '@blueprintjs/core';

export const ToasterMessage = ({title, Content, onDismissClick}) => {
  return (
    <div className="success-toaster-content">
      <div className="success-toaster-header">
        <h5 className="success-toaster-title">{title}</h5>
        <div className="pt-button-group pt-minimal success-toaster-dismiss">
          <Button iconName="cross"
            onClick={onDismissClick}
          />
        </div>
      </div>
      <div className="success-toaster-body">
        <Content />
      </div>
    </div>
  );
};

export default ToasterMessage;
