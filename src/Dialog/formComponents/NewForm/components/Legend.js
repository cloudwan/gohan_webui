import React from 'react';
import ProtoTypes from 'prop-types';

import styles from './Legend.css';

const Legend = ({children}) => (
  <legend className={styles.legend}>
    {children}
  </legend>
);

export default Legend;

if (process.env.NODE_ENV !== 'production') {
  Legend.propTypes = {
    children: ProtoTypes.node.isRequired,
  };
}
