import React from 'react';
import {SortableElement} from 'react-sortable-hoc';

import styles from './SortableListItem.css';

const SortableListItem = SortableElement(({children}) => (
  <li className={styles.listItem}>
    {children}
  </li>
));

export default SortableListItem;
