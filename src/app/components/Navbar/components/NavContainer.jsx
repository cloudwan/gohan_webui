import React from 'react';
import PropTypes from 'prop-types';

import styles from './navContainer.css';

export const NavContainer = ({
  children = null,
  withSidebar = true,
}) => (
  <nav className={styles[`navContainer${withSidebar ? 'WithSidebar' : ''}`]}>
    {children}
  </nav>
);

export default NavContainer;

if (process.env.NODE_ENV !== 'production') {
  NavContainer.propTypes = {
    children: PropTypes.node,
    withSidebar: PropTypes.bool,
  };
}
