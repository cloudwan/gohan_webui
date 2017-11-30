import React from 'react';

import styles from './ArrayItemBar.css';

const ArrayItemBar = ({children}) => (
  <div className={styles.bar}>
    {children}
  </div>
);
export default ArrayItemBar;
