import React from 'react';

import styles from './ArrayItemActions.css';

const ArrayItemActions = ({children}) => (
  <div className={styles.actions}>
    {children}
  </div>
);

export default ArrayItemActions;
