import React from 'react';
import ProtoTypes from 'prop-types';
import {Menu as BlueprintMenu} from '@blueprintjs/core';

export const Menu = ({children = null}) => (
  <BlueprintMenu className="pt-large">
    {children}
  </BlueprintMenu>
);

export default Menu;

if (process.env.NODE_ENV !== 'production') {
  Menu.propTypes = {
    children: ProtoTypes.node,
  };
}
