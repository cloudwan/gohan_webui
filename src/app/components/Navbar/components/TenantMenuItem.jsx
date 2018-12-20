import React, {PureComponent} from 'react';
import ProtoTypes from 'prop-types';

import {
  MenuItem,
} from '@blueprintjs/core';

export class TenantMenuItem extends PureComponent {
  handlesMenuItemClick = () => {
    const {
      text,
      onClick,
      id,
    } = this.props;

    onClick(text, id);
  };

  render() {
    const {
      text,
      iconName,
    } = this.props;

    return (
      <MenuItem text={text}
        onClick={this.handlesMenuItemClick}
        iconName={iconName}
      />
    );
  }
}

export default TenantMenuItem;

if (process.env.NODE_ENV !== 'production') {
  TenantMenuItem.propTypes = {
    text: ProtoTypes.string.isRequired,
    onClick: ProtoTypes.func.isRequired,
    iconName: ProtoTypes.string,
  };
}
