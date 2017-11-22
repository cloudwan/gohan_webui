import React from 'react';
import ProtoTypes from 'prop-types';
import {MenuItem as BlueprintMenuItem} from '@blueprintjs/core';

export const MenuItem = ({text = '', href = '', isActive = false}) => (
  <BlueprintMenuItem text={text}
    href={href}
    className={`item${(isActive ? ' pt-active' : '')}`}
  />
);

export default MenuItem;

if (process.env.NODE_ENV !== 'production') {
  MenuItem.propTypes = {
    text: ProtoTypes.string,
    href: ProtoTypes.string,
    isActive: ProtoTypes.bool,
  };
}
