import React from 'react';
import ProtoTypes from 'prop-types';

import styles from './Description.css';

const Description = ({children}) => (
  <span className={styles.description}>
    {children}
  </span>
);

export default Description;

if (process.env.NODE_ENV !== 'production') {
  Description.propTypes = {
    children: ProtoTypes.node,
  };
}
