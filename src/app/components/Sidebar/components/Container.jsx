import React from 'react';
import ProtoTypes from 'prop-types';

import styles from './container.css';

export const Container = ({children = null, isOpen = false}) => (
  <div className={styles[isOpen ? 'open' : 'sidebar']}>
    <div className={styles.navSidebar}>
      {children}
    </div>
  </div>
);

export default Container;

if (process.env.NODE_ENV !== 'production') {
  Container.propTypes = {
    children: ProtoTypes.node
  };
}
