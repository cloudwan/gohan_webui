import React from 'react';
import PropTypes from 'prop-types';
import {MenuItem as BlueprintMenuItem} from '@blueprintjs/core';

import styles from './menuItem.css';

export const MenuItem = ({
  text = '',
  href = '',
  isActive = false,
  onClick = () => {},
}) => (
  <BlueprintMenuItem text={text}
    href={href}
    className={styles[isActive ? 'active' : 'item']}
    onClick={onClick}
  />
);

export default MenuItem;

if (process.env.NODE_ENV !== 'production') {
  MenuItem.propTypes = {
    text: PropTypes.string,
    href: PropTypes.string,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
  };
}
