import React from 'react';
import ProtoTypes from 'prop-types';

import styles from './Label.css';

const Label = ({children, htmlFor}) => (
  <label className={styles.label}
    {...{htmlFor,}}>
    {children}
  </label>
);

export default Label;

if (process.env.NODE_ENV !== 'production') {
  Label.propTypes = {
    children: ProtoTypes.node.isRequired,
    htmlFor: ProtoTypes.string.isRequired,
  };
}
