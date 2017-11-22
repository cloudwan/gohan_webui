import React from 'react';
import PropTypes from 'prop-types';
import {Menu as BlueprintMenu} from '@blueprintjs/core';

export const Menu = ({children = null}) => (
  <BlueprintMenu>
    {children}
  </BlueprintMenu>
);

export default Menu;

if (process.env.NODE_ENV !== 'production') {
  Menu.propTypes = {
    children: PropTypes.node,
  };
}
