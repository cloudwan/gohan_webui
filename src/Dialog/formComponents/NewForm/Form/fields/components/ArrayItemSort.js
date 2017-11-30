import React from 'react';

import styles from './ArrayItemSort.css';

const ArrayItemSort = ({children}) => (
  <div className={styles.sort}>
    {children}
  </div>
);

export default ArrayItemSort;
