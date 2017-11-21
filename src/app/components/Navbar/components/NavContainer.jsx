import React from 'react';
import ProtoTypes from 'prop-types';

import styles from './navContainer.css';

export const NavContainer = ({children = null}) => (
  <nav className={styles.navContainer}>
    {children}
  </nav>
);

export default NavContainer;

if (process.env.NODE_ENV !== 'production') {
  NavContainer.propTypes = {
    children: ProtoTypes.node
  };
}
