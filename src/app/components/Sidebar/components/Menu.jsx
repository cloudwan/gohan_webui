import React from 'react';
import ProtoTypes from 'prop-types';
import {Menu as BlueprintMenu} from '@blueprintjs/core';

import styles from './menu.css';

export const Menu = ({children = null}) => (
  <BlueprintMenu className={styles.menu}>
    {children}
  </BlueprintMenu>
);

if (process.env.NODE_ENV !== 'production') {
  Menu.propTypes = {
    children: ProtoTypes.node,
  };
}

export default Menu;
