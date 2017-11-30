import React from 'react';
import ProtoTypes from 'prop-types';

import styles from './Fieldset.css';

const Fieldset = ({children}) => (
  <fieldset className={styles.objectField}>
    {children}
  </fieldset>
);


export default Fieldset;

if (process.env.NODE_ENV !== 'production') {
  Fieldset.propTypes = {
    children: ProtoTypes.node.isRequired,
  };
}
