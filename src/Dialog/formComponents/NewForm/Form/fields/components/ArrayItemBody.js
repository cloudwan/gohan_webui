import React from 'react';

import styles from './ArrayItemBody.css';

const ArrayItemBody = ({children}) => (
  <div className={styles.body}>
    {children}
  </div>
);


export default ArrayItemBody;
